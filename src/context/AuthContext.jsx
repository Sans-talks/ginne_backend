import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("ginneUser") || sessionStorage.getItem("ginneUser");
        const storedToken = localStorage.getItem("ginneToken") || sessionStorage.getItem("ginneToken");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = (userData, userToken, remember = false) => {
        const storage = remember ? localStorage : sessionStorage;

        // Clear previous sessions
        localStorage.removeItem("ginneUser");
        localStorage.removeItem("ginneToken");
        sessionStorage.removeItem("ginneUser");
        sessionStorage.removeItem("ginneToken");

        storage.setItem("ginneUser", JSON.stringify(userData));
        storage.setItem("ginneToken", userToken);

        setUser(userData);
        setToken(userToken);
    };

    const logout = () => {
        localStorage.removeItem("ginneUser");
        localStorage.removeItem("ginneToken");
        sessionStorage.removeItem("ginneUser");
        sessionStorage.removeItem("ginneToken");

        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
