import express from "express";
import axios from "axios";
import pool from "../db/postgres.js";

const router = express.Router();
const AI_SERVICE_URL = "http://localhost:8000";

router.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    // Step 1: Ask FastAPI to generate SQL
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/generate-sql`, {
      question,
    });

    const { sql, chart_type, x_key, y_key } = aiResponse.data;

    // Step 2: Run SQL against PostgreSQL
    const result = await pool.query(sql);

    if (!result.rows || result.rows.length === 0) {
      return res.json({
        question,
        sql,
        data: [],
        chart_type,
        x_key,
        y_key,
        message: "No data found for this query.",
      });
    }

    // Step 3: Return to frontend
    res.json({
      question,
      sql,
      data: result.rows,
      chart_type,
      x_key,
      y_key,
    });

  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "AI service is not running. Start it with: uvicorn main:app --reload --port 8000",
      });
    }
    console.error("❌ /ask error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;