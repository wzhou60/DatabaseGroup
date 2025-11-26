import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CartPage from './pages/CartPage.jsx';
import ReportsPage from './pages/reports.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import { Coffee, ShoppingCart, BarChart3, LogIn } from 'lucide-react'; 

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCart([]);
    alert('Logged out');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar cartCount={cartCount} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/login" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/orders" element={<OrdersPage orders={orders} setOrders={setOrders} />} />
          <Route path="/checkout" element={
            <CheckoutPage
              cart={cart}
              setCart={setCart}
              orders={orders}
              setOrders={setOrders}
              isLoggedIn={isLoggedIn}
            />}
          />
        </Routes> 
      </div>
    </BrowserRouter>
  );
}

export default App
