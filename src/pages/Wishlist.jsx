import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import "../styles/products.css"; // Reusing product grid styles

function Wishlist() {
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    return (
        <div className="products-page-container fade-in" style={{ padding: "40px 4%" }}>
            <div className="wishlist-header" style={{ marginBottom: "30px" }}>
                <h2 style={{ fontSize: "24px", color: "var(--primary-color)" }}>My Wishlist ({wishlist.length} Items)</h2>
            </div>

            {wishlist.length === 0 ? (
                <div className="no-products-found" style={{ textAlign: "center", marginTop: "100px" }}>
                    <div className="no-results-icon">❤</div>
                    <h3>Your wishlist is empty!</h3>
                    <p>Explore our collections and save your favorites here.</p>
                    <button
                        className="clear-filters-btn"
                        onClick={() => navigate("/products")}
                        style={{ marginTop: "20px" }}
                    >
                        CONTINUE SHOPPING
                    </button>
                </div>
            ) : (
                <div className="product-grid">
                    {wishlist.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
