import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

function App() {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate('/home')
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 transform transition-all duration-500 hover:scale-105">
                <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-4">Welcome to VacList</h1>
                <p className="text-lg text-gray-700 text-center mb-6">
                    Discover amazing travel destinations across Thailand and start planning your next adventure.
                </p>
                <div className="flex justify-center">
                    <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300" onClick={() => navigate('/login')}>
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
