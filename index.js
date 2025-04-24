const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) return console.error("Database error:", err);
  console.log("✅ Connected to MySQL");
});
db.query(
  `
  CREATE TABLE IF NOT EXISTS abnormalF (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_name VARCHAR(100),
    plate VARCHAR(20),
    amount INT,
    status ENUM('pending', 'approved', 'auto-approved', 'rejected', 'done') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME NULL,
    rejected_at DATETIME NULL,
    business_name VARCHAR(100)
  )
`,
  (err, result) => {
    if (err) {
      console.error("❌ Failed to create abnormalF table:", err);
    } else {
      console.log("✅ abnormalF table ready (created or already exists).");
    }
  }
);


// Test route
app.get("/", (req, res) => {
  res.send("Fuel Backend is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
