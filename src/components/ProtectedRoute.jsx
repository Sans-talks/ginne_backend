import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="loading-container">Loading...</div>; // Or a proper spinner
    }

    if (!user) {
        // Redirect toward the login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user.role !== "admin") {
        // If user is not admin and tries to access admin route, redirect to products
        return <Navigate to="/products" replace />;
    }

    return children;
};

export default ProtectedRoute;
