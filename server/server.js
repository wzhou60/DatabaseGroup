import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import oracledb from "oracledb";


const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------------------------------------------------
// DATABASE CONFIGURATION
// ---------------------------------------------------------
const dbConfig = {
  user: "COMP214_F25_ers_38",
  password: "password",
  //connectString: "199.212.26.208:1521/SQLD", // remote
  connectString: "oracle1.centennialcollege.ca:1521/SQLD" // at centennial
};

// Helper function to execute SQL
async function executeSql(sql, binds = []) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(sql, binds, { autoCommit: true });
    return result;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
// ---------------------------------------------------------
// API ENDPOINTS
// ---------------------------------------------------------

// TASK 1: Update Product Name (sp_product_update)
app.post("/api/update-product", async (req, res) => {
  try {
    const { prodId, name } = req.body;
    await executeSql(`BEGIN sp_product_update(:id, :name); END;`, { id: prodId, name: name });
    res.json({ success: true, message: `Product ${prodId} updated to "${name}"` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TASK 2: Add New Product (PROD_ADD_SP)
app.post("/api/add-product", async (req, res) => {
  try {
    const { name, desc, image, price, status } = req.body;
    await executeSql(`BEGIN PROD_ADD_SP(:name, :desc, :img, :price, :status); END;`, {
      name,
      desc,
      img: image,
      price: Number(price),
      status: Number(status),
    });
    res.json({ success: true, message: "New product added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---  Get All Products (For Task 2 ) ---
app.get("/api/products", async (req, res) => {
  try {
    // Ordering by ID DESC so the newest added product appears at the top/start
    const result = await executeSql(`SELECT * FROM bb_product ORDER BY idproduct DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---  Search Product by Name (For Task 2) ---
app.get("/api/products/search", async (req, res) => {
  try {
    const { name } = req.query;
    // Case-insensitive using UPPER
    const result = await executeSql(
      `SELECT * FROM bb_product WHERE UPPER(productname) LIKE UPPER(:name) ORDER BY idproduct`,
      { name: `%${name}%` }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TASK 3: Calculate Tax (TAX_COST_SP with OUT parameter)
app.post("/api/calc-tax", async (req, res) => {
  try {
    const { state, subtotal } = req.body;
    const result = await executeSql(`BEGIN TAX_COST_SP(:st, :sub, :tax); END;`, {
      st: state,
      sub: Number(subtotal),
      tax: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });
    res.json({ success: true, taxAmount: result.outBinds.tax });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TASK 4: Update Order Status (STATUS_SHIP_SP)
app.post("/api/ship-status", async (req, res) => {
  try {
    const { basketId, date, shipper, track } = req.body;
    // Using TO_DATE to handle string date input safely
    await executeSql(`BEGIN STATUS_SHIP_SP(:bid, TO_DATE(:dt, 'YYYY-MM-DD'), :shp, :trk); END;`, {
      bid: Number(basketId),
      dt: date, // Expected format YYYY-MM-DD from frontend
      shp: shipper,
      trk: track,
    });
    res.json({ success: true, message: "Shipping status updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TASK 5: Add Item to Basket (BASKET_ADD_SP)
app.post("/api/add-basket", async (req, res) => {
  try {
    const { basketId, prodId, price, qty, size, form } = req.body;
    await executeSql(`BEGIN BASKET_ADD_SP(:bid, :pid, :price, :qty, :size, :form); END;`, {
      bid: Number(basketId),
      pid: Number(prodId),
      price: Number(price),
      qty: Number(qty),
      size: Number(size),
      form: Number(form),
    });
    res.json({ success: true, message: "Item added to basket" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TASK 6: Check Sale Function (CK_SALE_SF)
app.post("/api/check-sale", async (req, res) => {
  try {
    const { date, prodId } = req.body;
    // Binding the function return value
    const result = await executeSql(
      `BEGIN :ret := CK_SALE_SF(TO_DATE(:dt, 'YYYY-MM-DD'), :pid); END;`,
      {
        ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        dt: date,
        pid: Number(prodId),
      }
    );
    res.json({ success: true, result: result.outBinds.ret });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// REPORT 1: Check Stock (CHECK_STOCK_SP)
app.post("/api/reports/check-stock", async (req, res) => {
  console.log("api");
  try {
    console.log("inside api");
    const { basketId } = req.body;
    const result = await executeSql(`BEGIN CHECK_STOCK_SP(:bid, :msg); END;`, {
      bid: Number(basketId),
      msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    });
    res.json({ success: true, stockStatus: result.outBinds.msg });
    console.log("Database Output:", result.outBinds.msg);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// REPORT 2: Total Spending Function (TOT_PURCH_SF)
app.post("/api/reports/shopper-total", async (req, res) => {
  try {
    const { shopperId } = req.body;
    const result = await executeSql(`BEGIN :ret := TOT_PURCH_SF(:sid); END;`, {
      ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      sid: Number(shopperId),
    });
    res.json({ success: true, totalSpent: result.outBinds.ret });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
