import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Sync searchTerm with URL if user navigates back/forward
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate("/products");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <h2 className="logo">GINNE</h2>
          </Link>
        </div>

        {/* Navigation Categories */}
        <div className="nav-categories">
          <Link to="/products?category=men">MEN</Link>
          <Link to="/products?category=women">WOMEN</Link>
          <Link to="/products?category=kids">KIDS</Link>
          <Link to="/products?category=home">HOME & LIVING</Link>
        </div>

        {/* Search Bar */}
        <div className="nav-center">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="nav-right">
          <div className="nav-action-item">
            <span className="action-icon">👤</span>
            <span className="action-label">{user ? user.name : "Profile"}</span>
            {user && (
              <div className="profile-dropdown">
                <button onClick={handleLogout}>Logout</button>
                {user.role === "admin" && (
                  <button onClick={() => navigate("/admin")}>Admin</button>
                )}
              </div>
            )}
          </div>

          <div className="nav-action-item" onClick={() => navigate("/wishlist")}>
            <span className="action-icon">♡</span>
            <span className="action-label">Wishlist</span>
            {wishlist.length > 0 && <span className="cart-count">{wishlist.length}</span>}
          </div>

          <div className="nav-action-item" onClick={() => navigate("/cart")}>
            <span className="action-icon">👜</span>
            <span className="action-label">Bag</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
