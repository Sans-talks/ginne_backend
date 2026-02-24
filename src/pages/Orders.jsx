import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      setOrders([]);
      return;
    }

    fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
        else setOrders([]);
      })
      .catch(() => setOrders([]));
  }, [token]);

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <h4>Order ID: {order._id}</h4>
            <p>Status: {order.status}</p>
            <p>Total: ₹ {order.totalAmount}</p>

            {order.items?.map(item => (
              <p key={item.product?._id}>
                {item.product?.name} × {item.quantity}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
