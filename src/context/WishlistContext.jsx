import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const { token } = useContext(AuthContext);

    const fetchWishlist = async () => {
        if (!token) {
            setWishlist([]);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/wishlist", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setWishlist(data);
            }
        } catch (err) {
            console.error("Fetch wishlist error:", err);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    const toggleWishlist = async (product) => {
        if (!token) return alert("Please login to manage your wishlist");

        try {
            const response = await fetch("http://localhost:5000/api/wishlist/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product._id || product.id })
            });

            const data = await response.json();
            if (response.ok) {
                setWishlist(data);
            }
        } catch (err) {
            console.error("Toggle wishlist error:", err);
        }
    };

    const isInWishlist = (id) => {
        return wishlist.some((item) => (item._id || item.id) === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
