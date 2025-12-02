import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CheckoutPage = ({ cart, setCart, orders, setOrders, isLoggedIn }) => {
  const navigate = useNavigate();

  // Default Image Logic
  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1524350876685-274059332603?w=400';

  const getImageSrc = (img) => {
    if (!img || img.trim() === '') return DEFAULT_IMAGE;
    if (img.startsWith('http')) return img;
    return `/${img}`;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      items: [...cart],
      subtotal,
      tax,
      total,
      status: 'pending',
      date: new Date().toISOString(),
      trackingNumber: null,
      shipper: null
    };

    setOrders([...orders, newOrder]);
    setCart([]);
    alert(`Order #${newOrder.id} placed successfully!`);
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <ShoppingCart size={64} />
          <p>Your cart is empty</p>
          <Link to="/" className="btn-checkout">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="checkout-items">
          <h2>Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <img 
                src={getImageSrc(item.image)} 
                alt={item.name}
                onError={(e) => { 
                  if (e.currentTarget.src !== DEFAULT_IMAGE) {
                    e.currentTarget.src = DEFAULT_IMAGE; 
                    e.currentTarget.onerror = null; 
                  }
                }}
              />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
              <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="checkout-summary">
          <h2>Payment Details</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (13%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={handlePlaceOrder} className="btn-checkout">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;