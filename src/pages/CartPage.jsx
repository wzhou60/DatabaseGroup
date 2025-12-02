import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import '../styles/cart.css';


const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate();

  // Local UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Default Image Logic
  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1524350876685-274059332603?w=400';

  const getImageSrc = (img) => {
    if (!img || img.trim() === '') return DEFAULT_IMAGE;
    if (img.startsWith('http')) return img;
    return `/${img}`;
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setShowRemoveConfirm(null);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      setShowRemoveConfirm(id);
      return;
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate("/checkout");
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setDiscount(0.1); // 10% discount
      alert("Coupon applied! 10% discount added.");
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
    setCouponCode("");
  };

  // 🧮 Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const taxableAmount = subtotal - discountAmount;
  const taxRate = 0.13; // 13% tax
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  return (
    <div className="page">
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={64} />
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/")} className="btn-checkout">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
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
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={isLoading}
                    >
                      -
                    </button>
                    <span>Qty: {item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>
                  <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                {showRemoveConfirm === item.id ? (
                  <div className="confirmation-dialog">
                    <p>Remove this item?</p>
                    <button onClick={() => removeItem(item.id)} className="btn-confirm">
                      Yes
                    </button>
                    <button onClick={() => setShowRemoveConfirm(null)} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRemoveConfirm(item.id)}
                    className="btn-remove"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="coupon-section">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
                disabled={isLoading}
              />
              <button onClick={applyCoupon} className="btn-coupon" disabled={isLoading}>
                Apply
              </button>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({discount * 100}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Tax (13%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-checkout"
              disabled={isLoading || cart.length === 0}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>

            <button onClick={() => navigate("/")} className="btn-checkout">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;