import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingCart, BarChart3, LogIn } from 'lucide-react';

const OrdersPage = ({ orders, setOrders }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipper, setShipper] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const updateShipping = (orderId) => {
    if (!trackingNumber || !shipper) {
      alert('Please enter tracking number and shipper');
      return;
    }

    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'shipped', trackingNumber, shipper }
        : order
    ));

    alert('Shipping status updated!');
    setTrackingNumber('');
    setShipper('');
    setSelectedOrderId(null);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };

  return (
    <div className="page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={64} />
          <p style={{paddingBottom: '50px' }}>No orders yet</p>
          <a href="/" className="btn-checkout"  >Start Shopping</a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="total-row total">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.status === 'shipped' && order.trackingNumber && (
                <div className="tracking-info">
                  <p><strong>Shipper:</strong> {order.shipper}</p>
                  <p><strong>Tracking #:</strong> {order.trackingNumber}</p>
                </div>
              )}

              {order.status === 'pending' && (
                <div className="shipping-update">
                  {selectedOrderId === order.id ? (
                    <div className="shipping-form">
                      <input
                        type="text"
                        placeholder="Tracking Number"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="shipping-input"
                      />
                      <input
                        type="text"
                        placeholder="Shipper (UPS, FedEx, etc.)"
                        value={shipper}
                        onChange={(e) => setShipper(e.target.value)}
                        className="shipping-input"
                      />
                      <div className="shipping-actions">
                        <button onClick={() => updateShipping(order.id)} className="btn-update">
                          Update Status
                        </button>
                        <button onClick={() => setSelectedOrderId(null)} className="btn-cancel">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedOrderId(order.id)} className="btn-ship">
                      Update Shipping Status
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;