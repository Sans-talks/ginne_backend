import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// 📝 Get user wishlist
export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
        res.json(wishlist ? wishlist.products : []);
    } catch (error) {
        console.error("Get Wishlist Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ❤️ Toggle product in wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }

        const index = wishlist.products.indexOf(productId);

        if (index === -1) {
            // Add to wishlist
            wishlist.products.push(productId);
        } else {
            // Remove from wishlist
            wishlist.products.splice(index, 1);
        }

        await wishlist.save();
        await wishlist.populate("products");

        res.json(wishlist.products);
    } catch (error) {
        console.error("Toggle Wishlist Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🧹 Clear wishlist
export const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (wishlist) {
            wishlist.products = [];
            await wishlist.save();
        }
        res.json([]);
    } catch (error) {
        console.error("Clear Wishlist Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
