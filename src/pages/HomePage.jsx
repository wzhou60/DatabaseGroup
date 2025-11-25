import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingCart, BarChart3, LogIn } from 'lucide-react';
import { products } from '../data/products';

const HomePage = ({ cart, setCart }) => {
  const [search, setSearch] = useState('');
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert('Added to cart!');
  };
  
  return (
    <div className="page">
      <div className="header">
        <h1>Premium Coffee Collection</h1>
        <input
          type="text"
          placeholder="Search coffee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="stock">Stock: {product.stock}</p>
            <button onClick={() => addToCart(product)} className="btn-add">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;