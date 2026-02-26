import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/admin.css";

function AdminDashboard() {
  const { token } = useContext(AuthContext);
  // Initialize with dummy data corresponding to the high-res fashion theme
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://ginne-backend.onrender.com/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    gst: 18,
    profitMargin: 20,
    discount: 10,
    category: "Men",
    subCategory: "T-Shirts",
    images: []
  });

  const categoryMap = {
    "Men": ["T-Shirts", "Shirts", "Jeans", "Trousers", "Sneakers", "Accessories"],
    "Women": ["Traditional", "Western", "Bags", "Footwear", "Jewellery"],
    "Kids": ["Boys Fashion", "Girls Fashion", "Baby Care", "Toys"],
    "Home & Living": ["Bed Linen", "Kitchen & Dining", "Decor", "Bath"]
  };

  // Derived price breakdown
  const basePriceVal = Number(form.basePrice) || 0;
  const gstAmount = basePriceVal * (form.gst / 100);
  const priceAfterGst = basePriceVal + gstAmount;
  const profitAmount = priceAfterGst * (form.profitMargin / 100);
  const priceAfterProfit = priceAfterGst + profitAmount;
  const discountAmount = priceAfterProfit * (form.discount / 100);
  const finalSellingPrice = Math.round(priceAfterProfit - discountAmount);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setForm({ ...form, [name]: value, subCategory: categoryMap[value][0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then((base64Images) => {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...base64Images] }));
    });
  };

  const removeImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.basePrice || form.images.length === 0) return alert("Please fill name, base price, and upload at least one image.");

    if (!token) return alert("You must be logged in as admin.");

    const productData = {
      ...form,
      price: finalSellingPrice,
      basePrice: Number(form.basePrice),
      gst: Number(form.gst),
      profitMargin: Number(form.profitMargin),
      discount: Number(form.discount),
      subCategory: form.subCategory // ensure subCategory is explicit
    };

    try {
      const url = editingId
        ? `https://ginne-backend.onrender.com/api/products/${editingId}`
        : "https://ginne-backend.onrender.com/api/products/add";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      await fetchProducts(); // Refresh the list from backend

      setForm({ name: "", description: "", basePrice: "", gst: 18, profitMargin: 20, discount: 10, category: "Men", subCategory: "T-Shirts", images: [] });
      setEditingId(null);
      setShowForm(false);
      alert(editingId ? "Product updated!" : "Product added!");

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (product) => {
    // Reconstruct base parameters if missing from older mock products
    // For a mock product with just "price", we assume basePrice was price and others 0, 
    // or we can reverse engineer, but for simplicity let's provide default fallbacks
    setForm({
      ...product,
      basePrice: product.basePrice || product.price,
      gst: product.gst !== undefined ? product.gst : 18,
      profitMargin: product.profitMargin !== undefined ? product.profitMargin : 20,
      discount: product.discount !== undefined ? product.discount : 10
    });
    setEditingId(product._id || product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    if (!token) return alert("You must be logged in as admin.");

    try {
      const response = await fetch(`https://ginne-backend.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setProducts(products.filter(p => (p._id || p.id) !== id));
      alert("Product deleted!");

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="admin-container fade-in">
      <div className="admin-header">
        <h2>Inventory Management</h2>
        {!showForm && (
          <button className="add-product-btn" onClick={() => setShowForm(true)}>
            + ADD NEW PRODUCT
          </button>
        )}
      </div>

      {showForm && (
        <div className="admin-form-section">
          <h3>{editingId ? "Modify Product Details" : "Create New Inventory Item"}</h3>
          <form onSubmit={handleSubmit} className="admin-form-layout">
            <div className="form-main">
              <div className="admin-grid-form">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>PRODUCT NAME</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Silk Party Dress"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>PRODUCT DESCRIPTION</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed product specifications, materials, and care instructions..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      border: '1px solid #d4d5d9',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>PRICING DETAILS</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>BASE PRICE (₹)</div>
                      <input type="number" name="basePrice" value={form.basePrice} onChange={handleInputChange} placeholder="1000" />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>GST (%)</div>
                      <input type="number" name="gst" value={form.gst} onChange={handleInputChange} placeholder="18" />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>PROFIT (%)</div>
                      <input type="number" name="profitMargin" value={form.profitMargin} onChange={handleInputChange} placeholder="20" />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>DISCOUNT (%)</div>
                      <input type="number" name="discount" value={form.discount} onChange={handleInputChange} placeholder="10" />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label>CATEGORY</label>
                      <select name="category" value={form.category} onChange={handleInputChange}>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Home & Living">Home & Living</option>
                      </select>
                    </div>
                    <div>
                      <label>SUB-CATEGORY</label>
                      <select name="subCategory" value={form.subCategory} onChange={handleInputChange}>
                        {(categoryMap?.[form.category] || []).map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group upload-container-new" style={{ gridColumn: '1 / -1' }}>
                  <label>UPLOAD IMAGES</label>
                  <label className="upload-box-new">
                    <div className="upload-icon-new">📁</div>
                    <div className="upload-text-new">Drag & drop images here or click to upload</div>
                    <div className="upload-btn-new">Select Images</div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {(form.images || []).length > 0 && (
                    <div className="upload-gallery-new">
                      {(form.images || []).map((img, index) => (
                        <div key={index} className="upload-thumb-card fade-in">
                          <img src={img} alt={`Preview ${index}`} />
                          <button type="button" onClick={() => removeImage(index)} className="upload-remove-btn" title="Remove image">✖</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="form-sidebar">
              <div className="pricing-summary-card">
                <h4>Pricing Summary</h4>
                <div className="summary-row">
                  <span>Base Price</span>
                  <span className="val">₹{basePriceVal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>GST (+{form.gst || 0}%)</span>
                  <span className="val text-orange">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Profit (+{form.profitMargin || 0}%)</span>
                  <span className="val text-green">₹{profitAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Discount (-{form.discount || 0}%)</span>
                  <span className="val text-red">₹{discountAmount.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Final Selling Price</span>
                  <span className="val-total">₹{finalSellingPrice}</span>
                </div>
              </div>

              <div className="sidebar-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? "UPDATE INVENTORY" : "SAVE TO INVENTORY"}
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({ name: "", description: "", basePrice: "", gst: 18, profitMargin: 20, discount: 10, category: "Men", subCategory: "T-Shirts", images: [] });
                  }}
                >
                  DISCARD
                </button>
              </div>
            </aside>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Entry</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Price Index</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((product) => (
              <tr key={product?._id || product?.id}>
                <td>
                  <img src={product.images?.[0] || product.image} alt={product.name} className="admin-table-img" />
                </td>
                <td style={{ fontWeight: 600 }}>{product.name}</td>
                <td>
                  <span className="category-tag">{product.category}</span>
                </td>
                <td style={{ fontWeight: 800, color: "var(--primary-color)" }}>₹{product.price}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>EDIT</button>
                  <button className="delete-btn" onClick={() => handleDelete(product?._id || product?.id)}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
