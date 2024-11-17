import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const VisitPage = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visits, setVisits] = useState({});
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/vacation-spots');
                setLocations(response.data);
                setLoading(false);

                const visitedSpots = {};
                response.data.forEach((location) => {
                    visitedSpots[location.id] = location.visits.some(visit => visit.user_id === user.id);
                });
                setVisits(visitedSpots);
            } catch (err) {
                setError('Failed to fetch locations');
                setLoading(false);
            }
        };

        fetchLocations();
    }, [user.id]);

    const favoriteLocations = locations.filter(location => visits[location.id]);

    const handleViewDetails = (locationId) => {
        navigate(`/location/${locationId}`);
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

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-500 via-orange-500 to-purple-600 flex items-center justify-center p-6 pt-28 pb-10 px-12">
            <Navbar />
            <div className="min-h-screen bg-red-50 p-4 rounded-lg w-full">
                <h1 className="text-3xl font-bold text-center mb-6">My Visits</h1>
                {favoriteLocations.length === 0 ? (
                    <div className="text-center text-lg text-gray-600">You haven't visited any spots yet.</div>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">Spot Name</th>
                            <th className="py-2 px-4 text-left">Location</th>
                            <th className="py-2 px-4 text-left">Category</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {favoriteLocations.map((location) => (
                            <tr key={location.id} className="border-b">
                                <td className="py-2 px-4">{location.name}</td>
                                <td className="py-2 px-4">{location.location}</td>
                                <td className="py-2 px-4">
                                        <span className={`px-3 py-1 rounded-full font-bold ${categoryStyles[location.category]}`}>
                                            {location.category.toUpperCase()}
                                        </span>
                                </td>
                                <td className="py-2 px-4 pb-7">
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

export default VisitPage;
