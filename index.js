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
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) return console.error("Database error:", err);
  console.log("✅ Connected to MySQL");
});

// app.get("/abnormalF", (req, res) => {
//   db.query(
//     "SELECT * FROM abnormalF ORDER BY created_at DESC",
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching abnormalF data:", err);
//         return res.status(500).json({ error: "Server error" });
//       }
//       res.json(results);
//     }
//   );
// });

app.post("/abnormalF", (req, res) => {
  console.log("🔥 POST /abnormalF hit"); // ADD THIS LINE

  const { driver_name, plate, amount, business_name } = req.body;

  if (!driver_name || !plate || !amount || !business_name) {
    console.log("❌ Missing fields:", req.body); // ADD THIS TOO
    return res.status(400).json({ error: "Missing required fields" });
  }

  const status = amount <= 200 ? "auto-approved" : "pending";

  const sql = `
    INSERT INTO abnormalF (driver_name, plate, amount, status, business_name)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [driver_name, plate, amount, status, business_name],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting into abnormalF:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
      console.log("✅ Inserted successfully:", result.insertId); // NEW
      res
        .status(201)
        .json({ success: true, insertedId: result.insertId, status });
    }
  );
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
