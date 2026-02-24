import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/cart.css";

function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal, cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  // Price calculations
  const platformFee = 20;
  const shippingFee = cartTotal > 999 || cartTotal === 0 ? 0 : 50;
  const grandTotal = cartTotal + platformFee + shippingFee;

  return (
    <div className="cart-page-container">
      <div className="cart-main-content">
        <h2 className="cart-header">SHOPPING BAG ({cartCount} ITEMS)</h2>

        {(cart || []).length === 0 ? (
          <div className="empty-cart-view">
            <div className="empty-icon">👜</div>
            <h3>Hey, it feels so light!</h3>
            <p>There is nothing in your bag. Let's add some items.</p>
            <button className="shop-now-btn" onClick={() => navigate("/products")}>
              ADD ITEMS FROM WISHLIST
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items Section */}
            <div className="cart-items-list">
              {(cart || []).map((item) => (
                <div key={item.itemId || item._id} className="cart-item-card">
                  <div className="item-image-box">
                    <img src={item.images?.[0] || item.image} alt={item.name} />
                  </div>
                  <div className="item-details-box">
                    <div className="item-header">
                      <h4 className="item-name">{item.name}</h4>
                      <button className="close-btn" onClick={() => removeFromCart(item.itemId || item._id)}>✕</button>
                    </div>
                    <p className="item-brand">Ginne Fashion</p>
                    <p className="item-category">Category: {item.category}</p>

                    <div className="item-qty-row">
                      <div className="qty-picker">
                        <button onClick={() => updateQty(item.itemId || item._id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.itemId || item._id, 1)}>+</button>
                      </div>
                      <div className="item-price">₹{(item.price || 0) * item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Section (Sidebar) */}
            <aside className="cart-pricing-sidebar">
              <h4 className="pricing-title">PRICE DETAILS ({cartCount} Items)</h4>
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
              <hr className="pricing-divider" />
              <div className="pricing-row total-amount">
                <span>Total Amount</span>
                <span>₹{grandTotal}</span>
              </div>
              <button className="place-order-btn" onClick={() => navigate("/checkout")}>
                PLACE ORDER
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
