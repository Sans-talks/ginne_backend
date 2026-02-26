import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css"; // Reusing login styles for consistency

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchCart } = useContext(CartContext);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://ginne-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Use AuthContext login (defaults to sessionStorage for registration if not specified, 
      // but here we can just pass false for remember)
      login(data.user, data.token, false);

      fetchCart();
      navigate("/products");

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <h2 className="logo" style={{ color: "#6C4DFF", marginBottom: "10px", textAlign: "center", fontSize: "32px" }}>GINNE</h2>
        <h2>Create Account</h2>
        <p className="login-subtitle">Join the Ginnee fashion community</p>

        {error && <div className="error-msg">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit" style={{ marginTop: "20px" }}>
            REGISTER NOW
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="signup-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
