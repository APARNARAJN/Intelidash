import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || "intelidash",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD,
});

const salesData = [
  { order_date: "2024-01-05", region: "North", product: "Laptop Pro", category: "Electronics", quantity: 3, unit_price: 1200, revenue: 3600 },
  { order_date: "2024-01-12", region: "South", product: "Office Chair", category: "Furniture", quantity: 10, unit_price: 250, revenue: 2500 },
  { order_date: "2024-01-18", region: "East", product: "Wireless Mouse", category: "Electronics", quantity: 25, unit_price: 45, revenue: 1125 },
  { order_date: "2024-01-22", region: "West", product: "Standing Desk", category: "Furniture", quantity: 5, unit_price: 600, revenue: 3000 },
  { order_date: "2024-02-03", region: "North", product: "Monitor 4K", category: "Electronics", quantity: 8, unit_price: 400, revenue: 3200 },
  { order_date: "2024-02-10", region: "South", product: "Laptop Pro", category: "Electronics", quantity: 2, unit_price: 1200, revenue: 2400 },
  { order_date: "2024-02-14", region: "East", product: "Office Chair", category: "Furniture", quantity: 7, unit_price: 250, revenue: 1750 },
  { order_date: "2024-02-20", region: "West", product: "Keyboard Mech", category: "Electronics", quantity: 15, unit_price: 120, revenue: 1800 },
  { order_date: "2024-03-01", region: "North", product: "Standing Desk", category: "Furniture", quantity: 4, unit_price: 600, revenue: 2400 },
  { order_date: "2024-03-08", region: "South", product: "Monitor 4K", category: "Electronics", quantity: 6, unit_price: 400, revenue: 2400 },
  { order_date: "2024-03-15", region: "East", product: "Laptop Pro", category: "Electronics", quantity: 5, unit_price: 1200, revenue: 6000 },
  { order_date: "2024-03-22", region: "West", product: "Wireless Mouse", category: "Electronics", quantity: 30, unit_price: 45, revenue: 1350 },
  { order_date: "2024-04-04", region: "North", product: "Keyboard Mech", category: "Electronics", quantity: 12, unit_price: 120, revenue: 1440 },
  { order_date: "2024-04-11", region: "South", product: "Standing Desk", category: "Furniture", quantity: 3, unit_price: 600, revenue: 1800 },
  { order_date: "2024-04-18", region: "East", product: "Monitor 4K", category: "Electronics", quantity: 9, unit_price: 400, revenue: 3600 },
  { order_date: "2024-04-25", region: "West", product: "Office Chair", category: "Furniture", quantity: 8, unit_price: 250, revenue: 2000 },
  { order_date: "2024-05-02", region: "North", product: "Laptop Pro", category: "Electronics", quantity: 4, unit_price: 1200, revenue: 4800 },
  { order_date: "2024-05-09", region: "South", product: "Wireless Mouse", category: "Electronics", quantity: 20, unit_price: 45, revenue: 900 },
  { order_date: "2024-05-16", region: "East", product: "Keyboard Mech", category: "Electronics", quantity: 18, unit_price: 120, revenue: 2160 },
  { order_date: "2024-05-23", region: "West", product: "Laptop Pro", category: "Electronics", quantity: 3, unit_price: 1200, revenue: 3600 },
  { order_date: "2024-06-06", region: "North", product: "Office Chair", category: "Furniture", quantity: 6, unit_price: 250, revenue: 1500 },
  { order_date: "2024-06-13", region: "South", product: "Monitor 4K", category: "Electronics", quantity: 11, unit_price: 400, revenue: 4400 },
  { order_date: "2024-06-20", region: "East", product: "Standing Desk", category: "Furniture", quantity: 7, unit_price: 600, revenue: 4200 },
  { order_date: "2024-06-27", region: "West", product: "Wireless Mouse", category: "Electronics", quantity: 40, unit_price: 45, revenue: 1800 },
  { order_date: "2024-07-04", region: "North", product: "Monitor 4K", category: "Electronics", quantity: 5, unit_price: 400, revenue: 2000 },
  { order_date: "2024-07-11", region: "South", product: "Keyboard Mech", category: "Electronics", quantity: 14, unit_price: 120, revenue: 1680 },
  { order_date: "2024-07-18", region: "East", product: "Laptop Pro", category: "Electronics", quantity: 6, unit_price: 1200, revenue: 7200 },
  { order_date: "2024-07-25", region: "West", product: "Office Chair", category: "Furniture", quantity: 9, unit_price: 250, revenue: 2250 },
  { order_date: "2024-08-01", region: "North", product: "Wireless Mouse", category: "Electronics", quantity: 35, unit_price: 45, revenue: 1575 },
  { order_date: "2024-08-08", region: "South", product: "Standing Desk", category: "Furniture", quantity: 4, unit_price: 600, revenue: 2400 },
  { order_date: "2024-08-15", region: "East", product: "Monitor 4K", category: "Electronics", quantity: 7, unit_price: 400, revenue: 2800 },
  { order_date: "2024-08-22", region: "West", product: "Laptop Pro", category: "Electronics", quantity: 5, unit_price: 1200, revenue: 6000 },
  { order_date: "2024-09-05", region: "North", product: "Keyboard Mech", category: "Electronics", quantity: 20, unit_price: 120, revenue: 2400 },
  { order_date: "2024-09-12", region: "South", product: "Office Chair", category: "Furniture", quantity: 12, unit_price: 250, revenue: 3000 },
  { order_date: "2024-09-19", region: "East", product: "Wireless Mouse", category: "Electronics", quantity: 28, unit_price: 45, revenue: 1260 },
  { order_date: "2024-09-26", region: "West", product: "Standing Desk", category: "Furniture", quantity: 6, unit_price: 600, revenue: 3600 },
  { order_date: "2024-10-03", region: "North", product: "Laptop Pro", category: "Electronics", quantity: 7, unit_price: 1200, revenue: 8400 },
  { order_date: "2024-10-10", region: "South", product: "Monitor 4K", category: "Electronics", quantity: 10, unit_price: 400, revenue: 4000 },
  { order_date: "2024-10-17", region: "East", product: "Office Chair", category: "Furniture", quantity: 11, unit_price: 250, revenue: 2750 },
  { order_date: "2024-10-24", region: "West", product: "Keyboard Mech", category: "Electronics", quantity: 16, unit_price: 120, revenue: 1920 },
  { order_date: "2024-11-07", region: "North", product: "Standing Desk", category: "Furniture", quantity: 8, unit_price: 600, revenue: 4800 },
  { order_date: "2024-11-14", region: "South", product: "Wireless Mouse", category: "Electronics", quantity: 45, unit_price: 45, revenue: 2025 },
  { order_date: "2024-11-21", region: "East", product: "Laptop Pro", category: "Electronics", quantity: 9, unit_price: 1200, revenue: 10800 },
  { order_date: "2024-11-28", region: "West", product: "Monitor 4K", category: "Electronics", quantity: 13, unit_price: 400, revenue: 5200 },
  { order_date: "2024-12-05", region: "North", product: "Office Chair", category: "Furniture", quantity: 14, unit_price: 250, revenue: 3500 },
  { order_date: "2024-12-12", region: "South", product: "Keyboard Mech", category: "Electronics", quantity: 22, unit_price: 120, revenue: 2640 },
  { order_date: "2024-12-19", region: "East", product: "Standing Desk", category: "Furniture", quantity: 10, unit_price: 600, revenue: 6000 },
  { order_date: "2024-12-26", region: "West", product: "Laptop Pro", category: "Electronics", quantity: 8, unit_price: 1200, revenue: 9600 },
];

async function seed() {
  try {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        order_date DATE NOT NULL,
        region VARCHAR(50) NOT NULL,
        product VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL,
        revenue NUMERIC(10,2) NOT NULL
      );
    `);
    console.log("✅ Table created (or already exists)");

    // Clear existing data
    await pool.query("DELETE FROM sales");
    console.log("🗑️  Cleared existing data");

    // Insert all rows
    for (const row of salesData) {
      await pool.query(
        `INSERT INTO sales (order_date, region, product, category, quantity, unit_price, revenue)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [row.order_date, row.region, row.product, row.category, row.quantity, row.unit_price, row.revenue]
      );
    }

    console.log(`✅ Seeded ${salesData.length} sales records`);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();