import express from "express";
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const PORT = 3000;
// Middleware
app.use(cors());
app.use(express.json());

// Sample route to test if server is working
app.get('/', (req, res) => {
    res.send('Hello, Vacation Spot Tracker API!');
});

// API Route to Get All Vacation Spots
app.get('/api/vacation-spots', async (req, res) => {
    try {
        const vacationSpots = await prisma.vacationSpot.findMany({
            include: {
                favorites: true, // If you want to include related data like favorites
                visits: true, // If you want to include related data like visits
                reviews: true, // If you want to include related reviews
            },
        });
        res.json(vacationSpots); // Send the result as JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching vacation spots' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
