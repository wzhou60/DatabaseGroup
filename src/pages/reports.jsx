import React, { useState } from 'react';
import '../styles/reports.css'
import { Link } from 'react-router-dom';
import { Coffee, ShoppingCart, BarChart3, LogIn } from 'lucide-react';

const ReportsPage = () => {
  const [basketId, setBasketId] = useState('');
  const [shopperId, setShopperId] = useState('');


  // New state for results
  const [stockResult, setStockResult] = useState('');
  const [spendingResult, setSpendingResult] = useState(null);

  const checkStock = async () => {
    try {
      //console.log("clicked");
      const response = await fetch('http://localhost:5000/api/reports/check-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basketId })
      });
      const data = await response.json();
      console.log("Server Response:", data);
      setStockResult(data.stockStatus);
    } catch (err) {
      alert("Error connecting to server");
      console.error(err);
    }
  };

  const checkSpending = async () => {
    try {
      //console.log("clicked");
      const response = await fetch('http://localhost:5000/api/reports/shopper-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopperId })
      });
      const data = await response.json();
      setSpendingResult(data.totalSpent);
    } catch (err) {
      alert("Error connecting to server");
      console.error(err);
    }
  };

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
          {/* Call the new function */}
          <button onClick={checkStock} className="btn-report">Check Inventory</button>
          
          {/* DISPLAY RESULT */}
          {stockResult && (
            <div className="result">
              <strong>Database Result:</strong> {stockResult}
            </div>
          )}

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
          {/* Call the new function */}
          <button onClick={checkSpending} className="btn-report">View Report</button>

          {/* Result Display */}
          {spendingResult !== null && (
             <div className ="result"  style={{marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e9', borderLeft: '5px solid #4caf50',color: '#333'}}>
               <strong>Total Spent:</strong> ${spendingResult}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;