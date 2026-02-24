import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCart } = useContext(CartContext);
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("user"); // "user" or "admin"

  // Get the location they were trying to go to
  const from = location.state?.from?.pathname || (loginType === "admin" ? "/admin" : "/products");

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const foundUser = data.user;

      if (foundUser.role !== loginType) {
        setError(`This account is not registered as an ${loginType}`);
        return;
      }

      // Save session via AuthContext
      login(foundUser, data.token, remember);

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      fetchCart();
      // Redirection logic: use 'from' if it's not the login/register pages
      const redirectPath = from.match(/^\/(login|register)$/)
        ? (foundUser.role === "admin" ? "/admin" : "/products")
        : from;

      navigate(redirectPath, { replace: true });

    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        {/* Website Logo/Title */}
        <h2 className="logo" style={{ color: "#6C4DFF", marginBottom: "10px", textAlign: "center", fontSize: "32px" }}>GINNE</h2>

        <h2>{loginType === "admin" ? "Admin Gateway" : "Welcome Back"}</h2>
        <p className="login-subtitle">
          {loginType === "admin"
            ? "Access the administrative dashboard"
            : "Login to your Ginnee account"}
        </p>

        {/* Admin/User Toggles */}
        <div className="role-toggle">
          <button
            className={loginType === "user" ? "active" : ""}
            onClick={() => setLoginType("user")}
          >
            User Login
          </button>
          <button
            className={loginType === "admin" ? "active" : ""}
            onClick={() => setLoginType("admin")}
          >
            Admin Login
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button className="login-btn" type="submit">
            {loginType === "admin" ? "LOGIN AS ADMIN" : "LOGIN TO ACCOUNT"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {loginType === "admin"
              ? "Confidential access only"
              : "New User?"}{" "}
            {loginType === "user" && (
              <Link to="/register" className="signup-link">Register</Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
