import React from "react";
import { Link } from "react-router-dom";
import { Coffee, ShoppingCart } from "lucide-react";

const Navbar = ({ cartCount, isLoggedIn, onLogout }) => (
  <nav className="navbar">
    <div className="nav-content">
      <Link to="/" className="logo">
        <Coffee size={32} />
        <span>Brewbean's</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Products</Link>
        <Link to="/reports">Reports</Link>

        {/* New Admin Link */}
        <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Admin
        </Link>
        <Link to="/orders">Orders</Link>

        <Link to="/cart" className="cart-link">
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        {isLoggedIn ? (
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn-login">
            Login
          </Link>
        )}
      </div>
    </div>
  </nav>
);

export default Navbar;
