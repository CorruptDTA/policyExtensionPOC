const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Connect PostgreSQL database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'privy_poc',
  password: process.env.DB_PASSWORD, 
  port: 5432,
});

// Create an endpoint that joins the tables and formats the data
app.get('/api/config', async (req, res) => {
  try {
    const query = `
      SELECT c.name, c.color_hex, c.border_hex, array_agg(k.term) as terms
      FROM privacy_categories c
      JOIN heuristic_keywords k ON c.id = k.category_id
      GROUP BY c.id;
    `;
    const result = await pool.query(query);
    
    // Format data for the extension
    const formattedData = result.rows.map(row => ({
      name: row.name,
      color: row.color_hex,
      borderColor: row.border_hex,
      terms: row.terms
    }));

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));