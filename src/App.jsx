import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Wishlist from "./pages/Wishlist";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const NavbarWrapper = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) return null;
  return <Navbar />;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-container">Loading Ginnee...</div>;
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <NavbarWrapper />

          <Routes>
            {/* Auth Routes: Always show Login page even if authenticated */}
            <Route
              path="/"
              element={<Login />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={
                user
                  ? <Navigate to={user.role === "admin" ? "/admin" : "/products"} replace />
                  : <Register />
              }
            />

            {/* User Protected Routes */}
            <Route
              path="/shop"
              element={<ProtectedRoute><Home /></ProtectedRoute>}
            />
            <Route
              path="/products"
              element={<ProtectedRoute><Products /></ProtectedRoute>}
            />
            <Route
              path="/product/:id"
              element={<ProtectedRoute><ProductDetails /></ProtectedRoute>}
            />
            <Route
              path="/cart"
              element={<ProtectedRoute><Cart /></ProtectedRoute>}
            />
            <Route
              path="/wishlist"
              element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
            />
            <Route
              path="/checkout"
              element={<ProtectedRoute><Checkout /></ProtectedRoute>}
            />
            <Route
              path="/orders"
              element={<ProtectedRoute><Orders /></ProtectedRoute>}
            />

            {/* Admin protected routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
