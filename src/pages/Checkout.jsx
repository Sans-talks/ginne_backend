import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/checkout.css";

function Checkout() {
  const { cart, cartTotal, clearCart, cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [isOrdered, setIsOrdered] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    addressLine: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const platformFee = 20;
  const shippingFee = cartTotal > 999 || cartTotal === 0 ? 0 : 50;
  const grandTotal = cartTotal + platformFee + shippingFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Simple validation
    if (!address.name || !address.phone || !address.pincode || !address.addressLine) {
      alert("Please fill in all address details.");
      return;
    }

    if (cart.length === 0) {
      alert("Your bag is empty!");
      navigate("/products");
      return;
    }

    // Mock order success
    setIsOrdered(true);
    clearCart();
    window.scrollTo(0, 0);
  };

  if (isOrdered) {
    return (
      <div className="checkout-success-container">
        <div className="success-content">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with GINNE. Your order will be delivered soon.</p>
          <div className="order-details-summary">
            <p><strong>Deliver to:</strong> {address.name}</p>
            <p>{address.addressLine}, {address.city} - {address.pincode}</p>
          </div>
          <button className="continue-shopping-btn" onClick={() => navigate("/products")}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-content">
        <div className="checkout-left">
          <h3 className="section-title">CONTACT DETAILS</h3>
          <form className="address-form" onSubmit={handlePlaceOrder}>
            <input
              type="text"
              name="name"
              placeholder="Name*"
              value={address.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Mobile No*"
              value={address.phone}
              onChange={handleChange}
              required
            />

            <h3 className="section-title">ADDRESS</h3>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode*"
              value={address.pincode}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="addressLine"
              placeholder="Address (House No, Building, Street, Area)*"
              value={address.addressLine}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Locality / Town / City*"
              value={address.city}
              onChange={handleChange}
              required
            />

            <div className="payment-section">
              <h3 className="section-title">PAYMENT METHOD</h3>
              <div className="payment-options">
                <label className="payment-option selected">
                  <input type="radio" name="payment" defaultChecked />
                  <span>Cash On Delivery (COD)</span>
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn-large">
              PLACE ORDER
            </button>
          </form>
        </div>

        <aside className="checkout-right">
          <h3 className="section-title">ORDER SUMMARY ({cartCount} Items)</h3>
          <div className="summary-items-mini">
            {cart.map(item => (
              <div key={item._id} className="mini-item">
                <img src={item.images?.[0] || item.image} alt={item.name} />
                <div className="mini-item-info">
                  <p className="mini-name">{item.name}</p>
                  <p className="mini-qty">Qty: {item.quantity}</p>
                  <p className="mini-price">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-pricing">
            <div className="pricing-row">
              <span>Total MRP</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="pricing-row">
              <span>Platform Fee</span>
              <span className="free">₹{platformFee}</span>
            </div>
            <div className="pricing-row">
              <span>Shipping Fee</span>
              <span className={shippingFee === 0 ? "free" : ""}>
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </span>
            </div>
            <hr className="divider" />
            <div className="pricing-row total">
              <span>Total Amount</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
