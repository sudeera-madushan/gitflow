// Main entry point - Server setup
const http = require("http");
const UserRoutes = require("./routes/userRoutes");
const ItemRoutes = require("./routes/itemRoutes");
const OrderRoutes = require("./routes/orderRoutes");

const PORT = process.env.PORT || 3000;
const userRoutes = new UserRoutes();
const itemRoutes = new ItemRoutes();
const orderRoutes = new OrderRoutes();

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route requests based on URL path
  const urlParts = req.url.split("/").filter((part) => part);

  if (urlParts.length >= 2 && urlParts[0] === "api") {
    if (urlParts[1] === "users") {
      userRoutes.handleRequest(req, res);
    } else if (urlParts[1] === "items") {
      itemRoutes.handleRequest(req, res);
    } else if (urlParts[1] === "orders") {
      orderRoutes.handleRequest(req, res);
    } else {
      // 404 Not Found
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  } else {
    // 404 Not Found
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`  - http://localhost:${PORT}/api/users`);
  console.log(`  - http://localhost:${PORT}/api/items`);
  console.log(`  - http://localhost:${PORT}/api/orders`);
});
