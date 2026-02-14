const express = require("express");
const axios = require("axios");
const router = express.Router();

const getPrediction = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/predict");
    res.json(response.data);
  } catch (error) {
    console.error("Error calling ML service:", error.message);
    res.status(500).json({ 
      error: "ML Service unavailable",
      details: error.message 
    });
  }
};

router.get("/predict", getPrediction);
router.get("/portfolio", getPrediction);

module.exports = router;
