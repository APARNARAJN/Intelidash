import { generateInsights } from "../utils/insightEngine.js";
import express from "express";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    let metrics = {
      revenueChange: -5,
      trafficChange: 0,
      conversionChange: -3
    };

    const insights = generateInsights(metrics);

    res.json({ insights });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Insight generation failed" });
  }
});

export default router;
