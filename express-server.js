const express = require("express");

const app = express();

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

// Middleware for validation
function validateConversion(req, res, next) {
  const { amount, currency } = req.query;

  if (!amount || !currency) {
    return res.status(400).json({
      error: "Amount and currency are required",
    });
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    return res.status(400).json({
      error: "Amount must be a valid number",
    });
  }

  if (!conversionRates[currency]) {
    return res.status(400).json({
      error: "Unsupported currency",
    });
  }

  req.numericAmount = numericAmount;

  next();
}

// Route
app.get("/convert", validateConversion, (req, res) => {
  const { currency } = req.query;

  const convertedAmount =
    req.numericAmount * conversionRates[currency];

  res.status(200).json({
    input: {
      amount: req.numericAmount,
      currency,
    },
    convertedAmount,
    unit: "RWF",
  });
});   

app.listen(2000, () => {
  console.log("Express server running on port 2000");
});