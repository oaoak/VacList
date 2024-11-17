import express from "express";
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to authenticate user by token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret key
        req.userId = decoded.userId; // Attach user ID from token payload
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

// Sample route to test if server is working
app.get('/', (req, res) => {
    res.send('Hello, Vacation Spot Tracker API!');
});

// Route to fetch the current user's details
app.get("/api/users/me", authenticateToken, async (req, res) => {
    try {
        // Fetch the authenticated user's details
        const user = await prisma.user.findUnique({
            where: { id: req.userId }, // Use the user ID from the token payload
            include: {
                favorites: true,
                visits: true,
                reviews: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Exclude the password before sending the response
        const { password, ...userWithoutPassword } = user;

        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
});

// Route to login a user and send back a JWT token
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await prisma.user.findFirst({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Return the token to the client
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
});

// Route to register a user and send back a JWT token
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for an existing user with the same username
        const existingUser = await prisma.user.findFirst({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Return the token to the client
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed" });
    }
});

// API Route to Get All Vacation Spots
app.get('/api/vacation-spots', async (req, res) => {
    try {
        const vacationSpots = await prisma.vacationSpot.findMany({
            include: {
                favorites: true,
                visits: true,
                reviews: true,
            },
        });
        res.json(vacationSpots); // Send the result as JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching vacation spots' });
    }
});

// Route for get vacation spot by id
app.get('/api/vacation-spots/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const spot = await prisma.vacationSpot.findUnique({
            where: { id: parseInt(id) },
            include: { reviews: true, favorites: true, visits: true },
        });

        if (!spot) {
            return res.status(404).json({ message: 'Vacation spot not found' });
        }

        res.json(spot);
    } catch (error) {
        console.error('Error fetching vacation spot:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Create or post new favorite
app.post("/api/vacation-spots/:id/favorite", async (req, res) => {
    const { id: spot_id } = req.params;
    const { user_id } = req.body; // Assume `user_id` is passed in the request body

    try {
        // Check if already favorited
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                user_id_spot_id: { user_id, spot_id: parseInt(spot_id) }, // Composite key
            },
        });

        if (existingFavorite) {
            return res.status(400).json({ error: "Already marked as favorite." });
        }

        // Add to favorites
        const favorite = await prisma.favorite.create({
            data: {
                user_id,
                spot_id: parseInt(spot_id),
            },
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error("Error marking as favorite:", error);
        res.status(500).json({ error: "Failed to mark as favorite." });
    }
});

//Update mark/unmark as favorite
app.put("/api/vacation-spots/:id/favorite", async (req, res) => {
    const { id: spot_id } = req.params;
    const { user_id } = req.body;

    try {
        // Check if the spot is already favorited
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                user_id_spot_id: { user_id, spot_id: parseInt(spot_id) }, // Composite key
            },
        });

        if (!existingFavorite) {
            return res.status(400).json({ error: "Favorite not found." });
        }

        // Remove from favorites
        await prisma.favorite.delete({
            where: {
                user_id_spot_id: { user_id, spot_id: parseInt(spot_id) }, // Composite key
            },
        });

        res.status(200).json({ message: "Unmarked as favorite." });
    } catch (error) {
        console.error("Error unmarking as favorite:", error);
        res.status(500).json({ error: "Failed to unmark as favorite." });
    }
});

// Api for writing a review
app.post('/api/vacation-spots/:id/reviews', async (req, res) => {
    const { id } = req.params; // spot_id from URL param
    const { user_id, rating, review_text } = req.body; // user_id, rating, and review_text from request body

    if (!user_id || !rating) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Create the review and connect the existing user
        const newReview = await prisma.review.create({
            data: {
                spot_id: parseInt(id), // Connect to the vacation spot
                user_id, // Use the user_id to link to the User
                rating, // Rating field
                review_text, // Review text
            },
        });

        res.status(201).json({
            message: 'Review submitted successfully.',
            review: newReview,
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review.' });
    }
});

// Api for updating a review
app.put('/api/vacation-spots/:id/reviews/:userId', async (req, res) => {
    const { id } = req.params; // spot_id from URL param
    const { userId } = req.params; // user_id from URL param
    const { rating, review_text } = req.body; // rating and review_text from request body

    if (!rating || !review_text) {
        return res.status(400).json({ error: 'Rating and review text are required.' });
    }

    try {
        // Update the review using the composite unique key (spot_id, user_id)
        const updatedReview = await prisma.review.update({
            where: {
                spot_id_user_id: {
                    spot_id: parseInt(id),
                    user_id: parseInt(userId),
                },
            },
            data: {
                rating,
                review_text,
            },
        });

        res.status(200).json({
            message: 'Review updated successfully.',
            review: updatedReview,
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review.' });
    }
});

// Get reviews for a specific vacation spot
app.get('/api/vacation-spots/:id/reviews', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch reviews for the vacation spot, including user info (like username)
        const reviews = await prisma.review.findMany({
            where: {
                spot_id: Number(id),
            },
            include: {
                user: {
                    select: {
                        username: true, // Include the username from the User table
                    },
                },
            },
            orderBy: {
                id: 'desc', // Order by most recent review first
            },
        });

        const reviewsWithFlags = await Promise.all(
            reviews.map(async (review) => {
                const visit = await prisma.visit.findFirst({
                    where: {
                        user_id: review.user_id,
                        spot_id: Number(id),
                    },
                });

                const favorite = await prisma.favorite.findFirst({
                    where: {
                        user_id: review.user_id,
                        spot_id: Number(id),
                    },
                });

                return {
                    ...review,
                    visited: !!visit,
                    isFavorite: !!favorite, // Add isFavorite flag
                };
            })
        );

        res.json(reviewsWithFlags);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

//Create or post new visits
app.post("/api/vacation-spots/:id/visit", async (req, res) => {
    const { id: spot_id } = req.params;
    const { user_id } = req.body; // Assume `user_id` is passed in the request body

    try {
        // Check if already visited
        const existingVisit = await prisma.visit.findUnique({
            where: {
                user_id_spot_id: { user_id, spot_id: parseInt(spot_id) }, // Composite key
            },
        });

        if (existingVisit) {
            return res.status(400).json({ error: "Already visited." });
        }

        // Add to favorites
        const visit = await prisma.visit.create({
            data: {
                user_id,
                spot_id: parseInt(spot_id),
            },
        });

        res.status(201).json(visit);
    } catch (error) {
        console.error("Error marking as favorite:", error);
        res.status(500).json({ error: "Failed to mark as favorite." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
