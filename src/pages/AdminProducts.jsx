import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/admin.css";
import noImage from "../assets/no-image.png";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const { token } = useContext(AuthContext);

  // ✅ Fetch all products
  useEffect(() => {
    fetch("https://ginne-backend.onrender.com/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, [token]);

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`https://ginne-backend.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  // ✅ EDIT PRODUCT (placeholder)
  const editProduct = (product) => {
    alert("Edit feature coming next 🚀");
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">

            {/* ✅ Final Image Fix */}
            <img
              src={product.images?.[0] || product.image || noImage}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = noImage;
              }}
            />

            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

            {/* Admin Controls */}
            <div className="admin-buttons">
              <button onClick={() => editProduct(product)}>Edit</button>
              <button
                className="delete-btn"
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;
