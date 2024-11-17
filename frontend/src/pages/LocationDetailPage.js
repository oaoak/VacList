import React, { useState, useEffect, useContext } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Navbar from "../components/Navbar";

const LocationDetailsPage = () => {
    const { id } = useParams(); // Get location ID from URL
    const { user } = useContext(UserContext);
    const [location, setLocation] = useState(null);
    const [rating, setRating] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]); // Store reviews here
    const [error, setError] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/vacation-spots/${id}`);
                setLocation(response.data);
            } catch (err) {
                console.error('Error fetching location details:', err);
            }
        };

        // Fetch the location details and reviews
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/vacation-spots/${id}/reviews`);
                setReviews(response.data); // Set the reviews
                const userReview = response.data.find(review => review.user_id === user.id);
                if (userReview) {
                    setHasReviewed(true);
                    setRating(userReview.rating); // Set the rating
                    setReviewText(userReview.review_text); // Set the review text
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchLocation();
        fetchReviews(); // Fetch reviews on initial load
    }, [id]);

    const handleSubmitReview = async () => {
        try {
            if (!rating) {
                setError('Please select a rating.');
                return;
            }

            const ratingEnum = ["one", "two", "three", "four", "five"][rating - 1];

            if (isEditing) {
                // Update review if editing
                await axios.put(`http://localhost:3000/api/vacation-spots/${id}/reviews/${user.id}`, {
                    rating: ratingEnum,
                    review_text: reviewText,
                });
            } else {
                // Submit new review
                await axios.post(`http://localhost:3000/api/vacation-spots/${id}/reviews`, {
                    user_id: user.id,
                    rating: ratingEnum,
                    review_text: reviewText,
                });
            }

            setHasReviewed(true);
            setIsEditing(false);

            // After submitting review, refetch the reviews
            const response = await axios.get(`http://localhost:3000/api/vacation-spots/${id}/reviews`);
            setReviews(response.data); // Update the reviews list
            setRating(1); // Reset rating
            setReviewText(''); // Clear review text
            setError(null); // Clear any previous error
            window.location.reload();
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Please fill rating.');
        }
    };

    const handleEditReview = () => {
        setIsEditing(true); // Enable edit mode
    };

    if (!location) return <div className="text-center text-lg">Loading...</div>;

    const ratingMap = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5
    };

    const displayStars = (rating) => {
        const numStars = ratingMap[rating] || 0;
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                    <svg
                        key={value}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={numStars >= value ? "gold" : "gray"} // Use gold for >= value and gray otherwise
                        className="w-6 h-6"
                    >
                        <path d="M12 2a1 1 0 0 1 .917.606l2.329 4.726 5.212.758a1 1 0 0 1 .554 1.705l-3.774 3.678.89 5.183a1 1 0 0 1-1.451 1.054L12 18.623l-4.647 2.445a1 1 0 0 1-1.45-1.054l.889-5.183-3.774-3.678a1 1 0 0 1 .554-1.705l5.211-.758L11.083 2.606A1 1 0 0 1 12 2z" />
                    </svg>
                ))}
            </div>
        );
    };

    const categoryStyles = {
        beach: "bg-blue-100 text-blue-800",
        island: "bg-teal-100 text-teal-800",
        historical: "bg-yellow-100 text-yellow-800",
        adventure: "bg-red-100 text-red-800",
        nature: "bg-green-100 text-green-800",
        mountain: "bg-purple-100 text-purple-800",
        temple: "bg-orange-100 text-orange-800",
        city: "bg-gray-100 text-gray-800",
        luxury: "bg-pink-100 text-pink-800",
        culinary: "bg-indigo-100 text-indigo-800",
        shopping: "bg-cyan-100 text-cyan-800",
        festival: "bg-lime-100 text-lime-800",
        wildlife: "bg-teal-200 text-teal-900",
        wellness: "bg-green-200 text-green-900",
        family: "bg-red-200 text-red-900",
        nightlife: "bg-purple-200 text-purple-900",
        romantic: "bg-pink-200 text-pink-900",
        eco_tourism: "bg-yellow-200 text-yellow-900",
        rural: "bg-brown-100 text-brown-800",
        diving: "bg-blue-200 text-blue-900"
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-500 via-orange-500 to-purple-600 flex items-center justify-center p-6 pt-28 pb-10 px-12">
            <Navbar/>
            <div className="w-full rounded-lg min-h-screen bg-red-50 p-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{location.name}</h1>
                    <p className="text-gray-700 mb-4">{location.location}</p>
                    <p className="text-gray-700 mb-4"><span className={`px-3 py-1 rounded-full font-bold ${categoryStyles[location.category]}`}>{location.category.toUpperCase()}</span></p>
                </div>

                <div className="bg-white rounded-lg shadow-md mt-6 p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                        {hasReviewed ? "Your Review" : "Write a Review"}
                    </h3>

                    {hasReviewed ? (
                        <div className="p-4 border-t">
                            <div className="flex items-center mt-2">
                                {isEditing ? (
                                    <>
                                        <p className="text-gray-600 mr-2">Rate:</p>
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <svg
                                                key={value}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={rating >= value ? "gold" : "gray"}
                                                className="w-8 h-8 cursor-pointer"
                                                onClick={() => setRating(value)}
                                            >
                                                <path
                                                    d="M12 2a1 1 0 0 1 .917.606l2.329 4.726 5.212.758a1 1 0 0 1 .554 1.705l-3.774 3.678.89 5.183a1 1 0 0 1-1.451 1.054L12 18.623l-4.647 2.445a1 1 0 0 1-1.45-1.054l.889-5.183-3.774-3.678a1 1 0 0 1 .554-1.705l5.211-.758L11.083 2.606A1 1 0 0 1 12 2z"
                                                />
                                            </svg>
                                        ))}
                                    </>
                                ) : (
                                    <div>
                                        {displayStars(rating)} {/* Show stars if not editing */}
                                        <p className="text-gray-700 pt-3">{reviewText}</p> {/* Show review text */}
                                    </div>
                                )}
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={handleEditReview}
                                    className="mt-4 bg-red-500 text-white hover:bg-red-600"
                                >
                                    Edit Review
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center mb-4">
                            <p className="text-gray-600 mr-2">Rate:</p>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <svg
                                    key={value}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={rating >= value ? "gold" : "gray"}
                                    className="w-8 h-8 cursor-pointer"
                                    onClick={() => setRating(value)}
                                >
                                    <path
                                        d="M12 2a1 1 0 0 1 .917.606l2.329 4.726 5.212.758a1 1 0 0 1 .554 1.705l-3.774 3.678.89 5.183a1 1 0 0 1-1.451 1.054L12 18.623l-4.647 2.445a1 1 0 0 1-1.45-1.054l.889-5.183-3.774-3.678a1 1 0 0 1 .554-1.705l5.211-.758L11.083 2.606A1 1 0 0 1 12 2z"
                                    />
                                </svg>
                            ))}
                        </div>
                    )}

                    {/* Show review form only if rating is selected or we're editing */}
                    {(!hasReviewed && rating || isEditing) && (
                        <div className="mt-4">
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                                placeholder="Write your review (optional)"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                            <button
                                onClick={handleSubmitReview}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
                            >
                                Submit Review
                            </button>
                            <a className="px-2"></a>
                            {isEditing && (
                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                <div className="bg-white rounded-lg shadow-md mt-6 p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Reviews</h3>
                    {reviews.length > 0 ? (
                        <div>
                            {reviews.map((review) => (
                                <div key={review.id} className="mb-4 p-4 border-b">
                                    <div className="flex items-center">
                                        <div className="mr-4 flex items-center space-x-2">
                                            <strong>{review.user.username}</strong>
                                        </div>
                                        {displayStars(review.rating)} {/* Call the function to display stars based on rating */}
                                    </div>
                                    <div className="mr-4 flex items-center space-x-2 py-2">
                                        {review.isFavorite && (
                                            <span
                                                className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                        ♥
                                                    </span>
                                        )}
                                        {review.visited && (
                                            <span
                                                className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                        Visited
                                                    </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mt-2">{review.review_text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationDetailsPage;

