import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingCart, BarChart3, LogIn } from 'lucide-react';

const ReportsPage = () => {
  const [basketId, setBasketId] = useState('');
  const [shopperId, setShopperId] = useState('');

  return (
    <div className="page">
      <h1>Reports Dashboard</h1>
      <div className="reports-grid">
        <div className="report-card">
          <h2>Inventory Check</h2>
          <input
            type="number"
            placeholder="Enter Basket ID"
            value={basketId}
            onChange={(e) => setBasketId(e.target.value)}
            className="report-input"
          />
          <button className="btn-report">Check Inventory</button>
          <p className="report-info">Verify if all items are in stock</p>
        </div>
        
        <div className="report-card">
          <h2>Shopper Spending</h2>
          <input
            type="number"
            placeholder="Enter Shopper ID (optional)"
            value={shopperId}
            onChange={(e) => setShopperId(e.target.value)}
            className="report-input"
          />
          <button className="btn-report">View Report</button>
          <p className="report-info">View total purchases by shopper</p>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;