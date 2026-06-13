import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema({
  id: String,
  type: String,
  position: Object,
  config: Object,
});

const dashboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  widgets: [widgetSchema],
});

export default mongoose.model("Dashboard", dashboardSchema);
