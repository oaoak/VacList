import React from 'react';
import Navbar from "../components/Navbar";
import LocationCard from "../components/LocationCard";

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-500 via-orange-500 to-purple-600 flex items-center justify-center p-6 pt-24">
            <Navbar/>
            <div className="min-h-screen bg-gradient-to-r from-yellow-500 via-orange-500 to-purple-600">
                <Navbar/>
                <div className="flex flex-wrap justify-center gap-6 p-6">
                    {/* Location Cards */}
                    <LocationCard/>
                </div>
            </div>
        </div>
    );
}

export default App;
