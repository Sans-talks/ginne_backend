import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "../styles/productCard.css";

function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    const inWishlist = isInWishlist(product._id || product.id);

    return (
        <div
            className="product-card fade-in"
            onClick={() => navigate(`/product/${product._id || product.id}`)}
            style={{ cursor: "pointer" }}
        >
            <div className="product-image-container">
                <img
                    src={product.images?.[0] || product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=533&q=80"}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=533&q=80";
                    }}
                />
                <div
                    className={`wishlist-icon ${inWishlist ? "active" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                >
                    {inWishlist ? "❤" : "♡"}
                </div>
            </div>
            <div className="product-info">
                <p className="product-brand">Ginne Fashion</p>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-row">
                    <span className="current-price">₹{product.price}</span>
                    <span className="original-price">₹{product.price + 500}</span>
                    <span className="discount">(₹500 OFF)</span>
                </div>
            </div>
            <div className="add-to-cart-container">
                <button
                    className="add-to-cart-btn-purple"
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                        alert(`${product.name} added to bag!`);
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
