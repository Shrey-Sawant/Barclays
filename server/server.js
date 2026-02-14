const express = require("express");
const cors = require("cors");
const predictRoutes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main prediction routes
app.use("/", predictRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Node API is running" });
});

app.listen(PORT, () => {
  console.log(`Node API running on port ${PORT}`);
});
