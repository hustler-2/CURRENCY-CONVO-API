const http = require("http");
const url = require("url");

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Check route and method
  if (req.method === "GET" && parsedUrl.pathname === "/convert") {
    const { amount, currency } = parsedUrl.query;

    // Validation
    if (!amount || !currency) {
      res.writeHead(400, { "Content-Type": "application/json" });

      return res.end(
        JSON.stringify({
          error: "Amount and currency are required",
        })
      );
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      res.writeHead(400, { "Content-Type": "application/json" });

      return res.end(
        JSON.stringify({
          error: "Amount must be a valid number",
        })
      );
    }

    if (!conversionRates[currency]) {
      res.writeHead(400, { "Content-Type": "application/json" });

      return res.end(
        JSON.stringify({
          error: "Unsupported currency",
        })
      );
    }

    const convertedAmount = numericAmount * conversionRates[currency];

    res.writeHead(200, { "Content-Type": "application/json" });

    return res.end(
      JSON.stringify({
        input: {
          amount: numericAmount,
          currency,
        },
        convertedAmount,
        unit: "RWF",
      })
    );
  }

  // Route not found
  res.writeHead(404, { "Content-Type": "application/json" });

  res.end(
    JSON.stringify({
      error: "Route not found",
    })
  );
});

server.listen(2000, () => {
  console.log("HTTP server running on port 2000");
});