import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";

const LocationCard = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState({});
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/vacation-spots');
                setLocations(response.data);
                setLoading(false);

                const favoriteSpots = {};
                response.data.forEach((location) => {
                    favoriteSpots[location.id] = location.favorites.some(fav => fav.user_id === user.id); // true or false
                });
                setFavorites(favoriteSpots);
            } catch (err) {
                setError('Failed to fetch locations');
                setLoading(false);
            }
        };

        fetchLocations();
    }, [user.id]);

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    const handleMarkAsFavorite = async (spotId) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/vacation-spots/${spotId}/favorite`, {
                user_id: user.id,
            });

            // Update the favorite status in state
            setFavorites((prevFavorites) => ({
                ...prevFavorites,
                [spotId]: true, // Mark the spot as favorite
            }));

            setLocations((prevLocations) =>
                prevLocations.map((location) =>
                    location.id === spotId
                        ? { ...location, favorites: [...location.favorites, { user_id: user.id }] } // Add to favorites count
                        : location
                )
            );

            console.log("Marked as favorite:", response.data);
        } catch (err) {
            console.error("Error marking as favorite:", err);
        }
    };

    const handleUnmarkAsFavorite = async (spotId) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/vacation-spots/${spotId}/favorite`, {
                user_id: user.id,
            });

            // Update the favorite status in state
            setFavorites((prevFavorites) => ({
                ...prevFavorites,
                [spotId]: false, // Unmark the spot as favorite
            }));

            setLocations((prevLocations) =>
                prevLocations.map((location) =>
                    location.id === spotId
                        ? {
                            ...location,
                            favorites: location.favorites.filter(
                                (fav) => fav.user_id !== user.id
                            ), // Remove from favorites count
                        }
                        : location
                )
            );

            console.log("Unmarked as favorite:", response.data);
        } catch (err) {
            console.error("Error unmarking as favorite:", err);
        }
    };

    const handleViewDetails = (locationId) => {
        navigate(`/location/${locationId}`); // Navigate to details page
    };

    return (
        <div className="min-h-screen bg-red-50 p-4 rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Vacation Spots</h1>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                    <div
                        key={location.id}
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">{location.name}</h2>
                        <p className="text-gray-600">
                            <span className="font-bold">Location:</span> {location.location}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold">Category:</span> {location.category}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Favorites: {location.favorites.length} | Visits: {location.visits.length} | Reviews: {location.reviews.length}
                        </p>
                        <div className="flex">
                            <button
                                onClick={() =>
                                    favorites[location.id]
                                        ? handleUnmarkAsFavorite(location.id)
                                        : handleMarkAsFavorite(location.id)
                                }
                                className={`${
                                    favorites[location.id]
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {favorites[location.id] ? 'Unfavorite' : 'Favorite'}
                            </button>
                            <a className="px-2"></a>
                            <button
                                onClick={() => handleViewDetails(location.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Check In &#x2713;
                            </button>
                            <a className="px-2"></a>
                            <button
                                onClick={() => handleViewDetails(location.id)}
                                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                            >
                                Reviews
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationCard;
