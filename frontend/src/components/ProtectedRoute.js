import React, { useContext } from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {UserContext} from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (user && location.pathname === "/") {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
