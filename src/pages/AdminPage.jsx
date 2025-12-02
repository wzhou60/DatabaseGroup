import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import {
  Settings,
  PlusCircle,
  DollarSign,
  Truck,
  ShoppingBag,
  Tag,
  Search,
  List,
} from "lucide-react";

const AdminPage = () => {
  const API_URL = "http://localhost:5000/api";
  // --- TASK 1: Update Product Name ---
  // Matches server.js endpoint /api/update-product
  const [task1, setTask1] = useState({ prodId: "", name: "" });
  const [msg1, setMsg1] = useState("");

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/update-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task1),
      });
      const data = await res.json();
      setMsg1(data.message || data.error);
      fetchProducts();
    } catch (err) {
      setMsg1("Error connecting to server");
    }
  };

  // --- TASK 2: Add New Product ---
  // Matches server.js endpoint /api/add-product
  const [task2, setTask2] = useState({
    name: "",
    desc: "",
    image: "",
    price: "",
    status: "",
  });
  const [msg2, setMsg2] = useState("");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task2),
      });
      const data = await res.json();
      setMsg2(data.message || data.error);
      fetchProducts();
    } catch (err) {
      setMsg2("Error connecting to server");
    }
  };

  // State for Product List & Search
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [showList, setShowList] = useState(false);

  // Helper to fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
      setShowList(true);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  // Helper for Search
  const handleSearchProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products/search?name=${searchName}`);
      const data = await res.json();
      setProducts(data);
      setShowList(true);
      console.log(filteredProducts);
    } catch (err) {
      console.error("Failed to search products");
    }
  };

  // const filteredProducts = products.filter((p) => p[1] && p[1].toLowerCase().includes(searchName.toLowerCase())  );

  //to fetch products once when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []); 

  // --- TASK 3: Calculate Tax ---
  // Matches server.js endpoint /api/calc-tax
  const [task3, setTask3] = useState({ state: "", subtotal: "" });
  const [msg3, setMsg3] = useState(null);

  const handleCalcTax = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/calc-tax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task3),
      });
      const data = await res.json();
      setMsg3(data.success ? `Tax Amount: $${data.taxAmount.toFixed(2)}` : data.error);
    } catch (err) {
      setMsg3("Error calculating");
    }
  };

  // --- TASK 4: Update Order Status ---
  // Matches server.js endpoint /api/ship-status
  const [task4, setTask4] = useState({ basketId: "", date: "", shipper: "", track: "" });
  const [msg4, setMsg4] = useState("");

  const handleShipStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/ship-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task4),
      });
      const data = await res.json();
      setMsg4(data.message || data.error);
    } catch (err) {
      setMsg4("Error updating status");
    }
  };

  // --- TASK 5: Add Item to Basket (Manual) ---
  // Matches server.js endpoint /api/add-basket
  const [task5, setTask5] = useState({
    basketId: "",
    prodId: "",
    price: "",
    qty: "",
    size: "",
    form: "",
  });
  const [msg5, setMsg5] = useState("");

  const handleAddToBasket = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/add-basket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task5),
      });
      const data = await res.json();
      setMsg5(data.message || data.error);
    } catch (err) {
      setMsg5("Error adding item");
    }
  };

  // --- TASK 6: Check Sale ---
  // Matches server.js endpoint /api/check-sale
  const [task6, setTask6] = useState({ date: "", prodId: "" });
  const [msg6, setMsg6] = useState("");

  const handleCheckSale = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/check-sale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task6),
      });
      const data = await res.json();
      setMsg6(data.result || data.error);
    } catch (err) {
      setMsg6("Error checking sale");
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-grid">
        {/* TASK 1: Edit Product */}
        <div className="card">
          <h3>
            <Settings size={20} /> 1. Update Product Name
          </h3>
          <form onSubmit={handleUpdateProduct}>
            <input
              type="number"
              placeholder="Product ID"
              value={task1.prodId}
              onChange={(e) => setTask1({ ...task1, prodId: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="New Description"
              value={task1.name}
              onChange={(e) => setTask1({ ...task1, name: e.target.value })}
              required
            />
            <button type="submit">Update</button>
          </form>
          {msg1 && <div className="result highlight">{msg1}</div>}
        </div>

        {/* TASK 2: Add Product */}
        <div className="card">
          <h3>
            <PlusCircle size={20} /> 2. Add New Product
          </h3>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Name"
              value={task2.name}
              onChange={(e) => setTask2({ ...task2, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={task2.desc}
              onChange={(e) => setTask2({ ...task2, desc: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={task2.price}
              onChange={(e) => setTask2({ ...task2, price: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Image Path (e.g. roasted.jpg)"
              value={task2.image}
              onChange={(e) => setTask2({ ...task2, image: e.target.value })}
            />
            <input
              type="number"
              placeholder="Active Status (0 or 1)"
              value={task2.status}
              onChange={(e) => setTask2({ ...task2, status: e.target.value })}
              min="0"
              max="1"
              required
            />
            <button type="submit">Add Product</button>
          </form>
          {msg2 && <div className="result highlight">{msg2}</div>}
        </div>

        {/* TASK 3: Calculate Tax */}
        <div className="card">
          <h3>
            <DollarSign size={20} /> 3. Calculate Tax
          </h3>
          <form onSubmit={handleCalcTax}>
            <input
              type="text"
              placeholder="State (e.g., VA)"
              value={task3.state}
              onChange={(e) => setTask3({ ...task3, state: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Subtotal"
              value={task3.subtotal}
              onChange={(e) => setTask3({ ...task3, subtotal: e.target.value })}
              required
            />
            <button type="submit">Calculate</button>
          </form>
          {msg3 && <div className="result highlight">{msg3}</div>}
        </div>

        {/* TASK 4: Shipping Status */}
        <div className="card">
          <h3>
            <Truck size={20} /> 4. Update Shipping Status
          </h3>
          <form onSubmit={handleShipStatus}>
            <input
              type="number"
              placeholder="Basket ID"
              value={task4.basketId}
              onChange={(e) => setTask4({ ...task4, basketId: e.target.value })}
              required
            />
            <input
              type="date"
              value={task4.date}
              onChange={(e) => setTask4({ ...task4, date: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Shipper (e.g. UPS)"
              value={task4.shipper}
              onChange={(e) => setTask4({ ...task4, shipper: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tracking #"
              value={task4.track}
              onChange={(e) => setTask4({ ...task4, track: e.target.value })}
              required
            />
            <button type="submit">Update Status</button>
          </form>
          {msg4 && <div className="result highlight">{msg4}</div>}
        </div>

        {/* TASK 5: Add to Basket */}
        <div className="card">
          <h3>
            <ShoppingBag size={20} /> 5. Manual Basket Add
          </h3>
          <form onSubmit={handleAddToBasket}>
            <input
              type="number"
              placeholder="Basket ID"
              value={task5.basketId}
              onChange={(e) => setTask5({ ...task5, basketId: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Prod ID"
              value={task5.prodId}
              onChange={(e) => setTask5({ ...task5, prodId: e.target.value })}
              required
            />
            <div className="row">
              <input
                type="number"
                placeholder="Price"
                value={task5.price}
                onChange={(e) => setTask5({ ...task5, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={task5.qty}
                onChange={(e) => setTask5({ ...task5, qty: e.target.value })}
                required
              />
            </div>
            <div className="row">
              <input
                type="number"
                placeholder="Size Code"
                value={task5.size}
                onChange={(e) => setTask5({ ...task5, size: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Form Code"
                value={task5.form}
                onChange={(e) => setTask5({ ...task5, form: e.target.value })}
                required
              />
            </div>
            <button type="submit">Add Item</button>
          </form>
          {msg5 && <div className="result highlight">{msg5}</div>}
        </div>

        {/* TASK 6: Check Sale */}
        <div className="card">
          <h3>
            <Tag size={20} /> 6. Check Sale Status
          </h3>
          <form onSubmit={handleCheckSale}>
            <input
              type="date"
              value={task6.date}
              onChange={(e) => setTask6({ ...task6, date: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Product ID"
              value={task6.prodId}
              onChange={(e) => setTask6({ ...task6, prodId: e.target.value })}
              required
            />
            <button type="submit">Check Sale</button>
          </form>
          {msg6 && <div className="result highlight">{msg6}</div>}
        </div>

        {/* --- PRODUCT SEARCH & LIST SECTION (Combined per requirement) --- */}
        <div className="product-search-section">
          <div className="search-header">
            <h2>Product Search & List</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Product Name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <button onClick={handleSearchProduct}>
                <Search size={18} /> Search
              </button>
              <button onClick={fetchProducts} className="btn-secondary">
                <List size={18} /> Show List
              </button>
            </div>
          </div>

          {showList && (
            <div className="table-responsive">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p) => (
                      <tr key={p[1]}>
                        <td>{p[0]}</td>
                        <td>{p[1]}</td>
                        <td>{p[2]}</td>
                        <td>
                          ${(p[4] !== undefined && p[4] !== null ? Number(p[4]) : 0).toFixed(2)}
                        </td>
                        <td>{p[8] === 1 ? "Active" : "Inactive"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
