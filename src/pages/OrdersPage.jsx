import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "../styles/orders.css";

const OrdersPage = ({ orders }) => {
  const getStatusClass = (status) => {
    if (!status) return "";
    return status.toLowerCase(); // returns 'pending', 'shipped', etc.
  };

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={64} />
          <p style={{ paddingBottom: "50px" }}>No orders yet</p>
          <a href="/" className="btn-checkout">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <div className="order-number">Order #{order.id}</div>
                  <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {(order.status || "").toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-image" style={{ backgroundImage: `url(${item.image})` }} />
                    <div className="item-details">
                      <div className="item-title">{item.name}</div>
                      <div className="item-sub">Qty: {item.quantity}</div>
                    </div>
                    <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="totals">
                  <div className="line">
                    <span className="muted">Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="line">
                    <span className="muted">Tax:</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="line total">
                    <span className="total">Total:</span>
                    <span className="total">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="actions">
                  <Link to="/admin" className="btn primary">
                    Update Shipping Status
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
