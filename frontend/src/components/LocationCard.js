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
    const [visits, setVisits] = useState({});
    const [modal, setModal] = useState({ open: false, spotId: null });
    const [searchQuery, setSearchQuery] = useState('');


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update search query as user types
    };

    const filteredLocations = locations.filter((location) => {
        return location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.location.toLowerCase().includes(searchQuery.toLowerCase());
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/vacation-spots');
                setLocations(response.data);
                setLoading(false);

                const favoriteSpots = {};
                const visitSpots = {};
                response.data.forEach((location) => {
                    favoriteSpots[location.id] = location.favorites.some(fav => fav.user_id === user.id);
                    visitSpots[location.id] = location.visits.some((visit) => visit.user_id === user.id);
                });
                setFavorites(favoriteSpots);
                setVisits(visitSpots);
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

    const handleCheckIn = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/vacation-spots/${modal.spotId}/visit`,
                { user_id: user.id }
            );

            // Update the state to mark as visited
            setVisits((prevVisits) => ({
                ...prevVisits,
                [modal.spotId]: true,
            }));

            setLocations((prevLocations) =>
                prevLocations.map((location) =>
                    location.id === modal.spotId
                        ? { ...location, visits: [...location.visits, { user_id: user.id }] }
                        : location
                )
            );

            console.log("Checked in successfully:", response.data);
        } catch (err) {
            console.error("Error during check-in:", err);
        } finally {
            setModal({ open: false, spotId: null }); // Close the modal
        }
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
        <div className="min-h-screen bg-red-50 p-4 rounded-lg w-[1400px]">
            <h1 className="text-3xl font-bold text-center mb-6">Vacation Spots</h1>
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    className="p-2 border rounded w-1/2"
                    placeholder="Search locations"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredLocations.length === 0 ? (
                    <div className="col-span-full text-center text-lg text-gray-500">
                        No location found
                    </div>
                ) : (
                    filteredLocations.map((location) => (
                    <div
                        key={location.id}
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">{location.name}</h2>
                        <p className="text-gray-600">
                            <span className="font-bold">Location:</span> {location.location}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold">Category:</span>
                            <span
                                className={`text-xs ml-2 px-3 py-1 rounded-full font-bold ${categoryStyles[location.category]}`}>{location.category.toUpperCase()}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Favorites: {location.favorites.length} | Visits: {location.visits.length} |
                            Reviews: {location.reviews.length}
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
                                        : 'bg-gray-500 text-white hover:bg-gray-600'
                                }`}
                            >
                                {favorites[location.id] ? '♥' : '♡'}
                            </button>
                            <a className="px-2"></a>
                            <button
                                onClick={() =>
                                    visits[location.id]
                                        ? null
                                        : setModal({open: true, spotId: location.id})
                                }
                                disabled={visits[location.id]}
                                className={`${
                                    visits[location.id]
                                        ? "bg-orange-500 text-white cursor-default hover:bg-orange-500"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                } px-10 py-2 rounded`}
                            >
                                {visits[location.id] ? "Visited" : "Check In ✓"}
                            </button>
                            <a className="px-2"></a>
                            <button
                                onClick={() => handleViewDetails(location.id)}
                                className="bg-purple-500 text-white px-10 py-2 rounded hover:bg-purple-600"
                            >
                                Reviews
                            </button>
                        </div>
                    </div>
                )))}
            </div>
            {modal.open && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <h2 className="text-xl font-bold mb-4">Confirm Check-In</h2>
                        <p>Are you sure you want to check in to this spot?</p>
                        <p>Once you checked in, you cannot undo your action.</p>
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={handleCheckIn}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2"
                            >
                                Yes, I want to check In
                            </button>
                            <button
                                onClick={() => setModal({open: false, spotId: null})}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationCard;
