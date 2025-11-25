import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Coffee } from 'lucide-react';

const Register = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      alert('Logged in successfully!');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <Coffee size={48} />
        </div>
        <h1>Welcome to Brewbean's</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-login-submit">Sign In</button>
        </form>
        <p className="demo-info">Demo: any email/password works</p>
      </div>
    </div>
  );
};

export default Register;