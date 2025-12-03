import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Coffee, ShoppingCart, BarChart3, LogIn } from "lucide-react";

const HomePage = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The default image
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1524350876685-274059332603?w=400";

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const TX = await fetch("http://localhost:5000/api/products");
        if (!TX.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await TX.json();

        if (isMounted) {
          // Map database rows to product objects
          const mappedProducts = data.map((row) => ({
            id: row[0],
            name: row[1],
            description: row[2],
            image: row[3],
            price: row[4],
            stock: row[14] !== null ? row[14] : 68, // Default stock if index 6 is missing
          }));

          setProducts(mappedProducts);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching products:", err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter(
    (p) => p.name && p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert("Added to cart!");
  };

  // Improved helper to determine the image source
  const getImageSrc = (img) => {
    // If database value is null, empty, or undefined, use default image
    if (!img || img.trim() === "") return DEFAULT_IMAGE;

    // If it's a URL (http/https), use it
    if (img.startsWith("http")) return img;

    return `/${img}`;
  };

  if (loading)
    return (
      <div className="page" style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Loading our collection...</p>
      </div>
    );
  if (error)
    return (
      <div className="page" style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        <p>Unable to load products. Please check your connection.</p>
      </div>
    );

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
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={getImageSrc(product.image)}
              alt={product.name}
              onError={(e) => {
                if (e.currentTarget.src !== DEFAULT_IMAGE) {
                  e.currentTarget.src = DEFAULT_IMAGE;
                  e.currentTarget.onerror = null;
                }
              }}
            />
            <h3>{product.name}</h3>
            <p className="price">
              ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
            </p>
            {product.description && (
              <p style={{ fontSize: "1rem", color: "#000000ff", marginBottom: "0.35rem" }}>
                {product.description}
              </p>
            )}
            <p style={{ fontSize: "0.9rem", color: "#2a2929ff", marginBottom: "0.5rem" }}>
              {"Stock:"} {product.stock}
            </p>

            <button onClick={() => addToCart(product)} className="btn-add">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
