import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import {useNavigate} from "react-router-dom";

const FavoriteSpots = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState({});
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/vacation-spots');
                setLocations(response.data);
                setLoading(false);

                const favoriteSpots = {};
                response.data.forEach((location) => {
                    favoriteSpots[location.id] = location.favorites.some(fav => fav.user_id === user.id);
                });
                setFavorites(favoriteSpots);
            } catch (err) {
                setError('Failed to fetch locations');
                setLoading(false);
            }
        };

        fetchLocations();
    }, [user.id]);

    const handleUnmarkAsFavorite = async (spotId) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/vacation-spots/${spotId}/favorite`, {
                user_id: user.id,
            });

            // Update favorite status for the current user and the location's total count
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

    const favoriteLocations = locations.filter(location => favorites[location.id]);

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    const handleViewDetails = (locationId) => {
        navigate(`/location/${locationId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-500 via-orange-500 to-purple-600 flex items-center justify-center p-6 pt-28 pb-10 px-12">
            <Navbar/>
            <div className="min-h-screen bg-red-50 p-4 rounded-lg w-full">
                <h1 className="text-3xl font-bold text-center mb-6">My Favorite Vacation Spots</h1>
                {favoriteLocations.length === 0 ? (
                    <div className="text-center text-lg text-gray-600">You have no favorite spots yet.</div>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">Spot Name</th>
                            <th className="py-2 px-4 text-left">Location</th>
                            <th className="py-2 px-4 text-left">Category</th>
                            <th className="py-2 px-4 text-left">Favorites</th>
                            <th className="py-2 px-4 pl-28 text-left" >Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {favoriteLocations.map((location) => (
                            <tr key={location.id} className="border-b">
                                <td className="py-2 px-4">{location.name}</td>
                                <td className="py-2 px-4">{location.location}</td>
                                <td className="py-2 px-4">{location.category}</td>
                                <td className="py-2 px-4">{location.favorites.length}</td>
                                <td className="py-2 px-4 pb-7">
                                    <button
                                        onClick={() => handleUnmarkAsFavorite(location.id)}
                                        className="bg-red-500 text-white text-center py-1 px-4 rounded hover:bg-red-600"
                                    >
                                        Unfavorite
                                    </button>
                                    <a className="px-5"></a>
                                    <button
                                        onClick={() => handleViewDetails(location.id)}
                                        className="bg-purple-500 text-white text-center py-1 px-4 rounded hover:bg-purple-600"
                                    >
                                        Reviews
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FavoriteSpots;
