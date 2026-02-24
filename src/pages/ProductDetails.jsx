import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "../styles/productDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [loading, setLoading] = useState(true);

    const inWishlist = product ? isInWishlist(product._id || product.id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setProduct(data);
                    setMainImage(data.images?.[0] || data.image);
                } else {
                    console.error("Failed to fetch product:", data.message);
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="product-details-container loading-state">
                <div className="loading-spinner"></div>
                <p>Fetching product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-container not-found">
                <div className="not-found-content">
                    <h1>404</h1>
                    <h2>Product Not Found</h2>
                    <p>The product you are looking for might have been moved or removed.</p>
                    <button className="back-btn-purple" onClick={() => navigate("/products")}>
                        BACK TO SHOP
                    </button>
                </div>
            </div>
        );
    }

    const imagesList = product.images || (product.image ? [product.image] : []);

    return (
        <div className="product-details-container fade-in">
            <div className="product-details-nav">
                <span className="breadcrumb" onClick={() => navigate("/products")}>Home</span>
                <span className="separator">/</span>
                <span className="breadcrumb" onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</span>
                <span className="separator">/</span>
                <span className="breadcrumb current">{product.name}</span>
            </div>

            <div className="product-details-content">
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="main-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=1066&q=80";
                            }}
                        />
                    </div>

                    {(imagesList || []).length > 1 && (
                        <div className="thumbnail-list">
                            {(imagesList || []).map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${mainImage === img ? "active" : ""}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info-details">
                    <div className="info-header">
                        <p className="product-brand">Ginne Fashion</p>
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-subtitle">{product.category} | {product.subCategory}</p>
                    </div>

                    <div className="product-price-section">
                        <div className="price-row">
                            <span className="current-price">₹{product.price}</span>
                            <span className="original-price">₹{product.price + 500}</span>
                            <span className="discount-tag">({Math.round(500 / (product.price + 500) * 100)}% OFF)</span>
                        </div>
                        <p className="tax-info">inclusive of all taxes</p>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="add-to-bag-btn"
                            onClick={() => {
                                addToCart(product);
                                alert(`${product.name} added to bag!`);
                            }}
                        >
                            <span className="btn-icon">👜</span> ADD TO BAG
                        </button>
                        <button
                            className={`wishlist-btn-details ${inWishlist ? "active" : ""}`}
                            onClick={() => toggleWishlist(product)}
                        >
                            {inWishlist ? "❤ WISHLISTED" : "♡ WISHLIST"}
                        </button>
                    </div>

                    <div className="product-description-container">
                        <div className="description-section">
                            <h3>PRODUCT STORY</h3>
                            <p>
                                Experience comfort and style with this premium {product.name.toLowerCase()}.
                                Perfectly crafted for a modern aesthetic, this {product.subCategory.toLowerCase()}
                                is a must-have addition to your {product.category.toLowerCase()} collection.
                            </p>
                        </div>

                        <div className="features-section">
                            <h3>KEY FEATURES</h3>
                            <ul className="features-list">
                                <li><strong>Quality:</strong> Premium grade materials</li>
                                <li><strong>Comfort:</strong> Breathable fabric for all-day wear</li>
                                <li><strong>Authenticity:</strong> 100% Original Product</li>
                                <li><strong>Delivery:</strong> Reliable & Fast shipping</li>
                            </ul>
                        </div>

                        <div className="service-vows">
                            <div className="service-item">
                                <span className="service-icon">🚚</span>
                                <span className="service-text">Fast Delivery</span>
                            </div>
                            <div className="service-item">
                                <span className="service-icon">🔄</span>
                                <span className="service-text">14 Days Return</span>
                            </div>
                            <div className="service-item">
                                <span className="service-icon">🛡️</span>
                                <span className="service-text">Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
