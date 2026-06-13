import express from "express";
import Dashboard from "../models/dashboard.js";

const router = express.Router();

// ✅ Get all dashboards
router.get("/", async (req, res) => {
  try {
    const dashboards = await Dashboard.find();
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Save or update a dashboard
router.post("/", async (req, res) => {
  try {
    const { name, widgets } = req.body;
    let dashboard = await Dashboard.findOne({ name });

    if (dashboard) {
      dashboard.widgets = widgets;
      await dashboard.save();
    } else {
      dashboard = await Dashboard.create({ name, widgets });
    }

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a dashboard by name
router.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    await Dashboard.deleteOne({ name });
    res.json({ message: "Dashboard deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
