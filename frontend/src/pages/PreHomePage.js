import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Logo from "../images/logo.png" // Your logo image

function App() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-700 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="w-full max-w-lg bg-black rounded-xl shadow-xl p-16 transform transition-all duration-800 hover:scale-110 hover:-rotate-2 z-10 relative overflow-hidden">
                <h1 className="text-7xl font-extrabold text-center text-white mb-8 tracking-widest transform rotate-1">
                    Welcome to Vacation Checklist!
                </h1>
                <p className="text-xl text-red-300 text-center mb-10 leading-relaxed opacity-90 transform rotate-2">
                    Mark and review your experience!
                </p>

                <div className="flex justify-center">
                    <button
                        className="px-20 py-10 bg-blue-600 text-white font-semibold rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 hover:shadow-2xl transform transition-all duration-500 ease-in-out scale-125"
                        onClick={() => navigate('/login')}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* Floating logos */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="floating-logos">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className={`line-${index + 1} logo-line`}>
                            {[...Array(1000)].map((_, logoIndex) => (
                                <img
                                    key={logoIndex}
                                    src={Logo}
                                    alt="Floating Logo"
                                    className="floating-logo"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
