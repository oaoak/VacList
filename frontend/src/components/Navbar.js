import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../images/logo.png";

function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsModalOpen(false); // Close the modal after logging out
        window.location.reload();
    };

    const openModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal without logging out
    };

    return (
        <nav className="bg-black fixed w-full z-20 top-0 left-0 border-b border-red-400">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <Link to="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={Logo} className="w-36" alt="Logo" />
                </Link>
                <div>
                    <ul className="flex flex-col font-medium border border-gray-100 rounded-lg bg-gray-50 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-red-100 items-center justify-center">
                        <li className="font-bold px-7 rounded-l-lg hover:bg-red-600 hover:text-white transition-all duration-300">
                            <NavLink
                                to="/home"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li> | </li>
                        <li className="font-bold px-7 hover:bg-red-600 hover:text-white transition-all duration-300">
                            <NavLink
                                to="/favorite"
                            >
                                Favorite
                            </NavLink>
                        </li>
                        <li> | </li>
                        <li className="font-bold px-7 rounded-r-lg hover:bg-red-600 hover:text-white transition-all duration-300">
                            <NavLink
                                to="/"
                            >
                                My Visit
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="flex pb-5">
                    <button
                        onClick={openModal}
                        type="button"
                        className="text-white bg-red-500 hover:bg-red-600 transition-colors: duration-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Modal for Logout Confirmation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-xl font-semibold text-center mb-4">Are you sure you want to log out?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors: duration-300"
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 text-white px-8 py-2 rounded-md hover:bg-gray-600 transition-colors: duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
