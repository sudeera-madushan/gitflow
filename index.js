// Main entry point
console.log("Hello, Node.js!");

const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Hello, Node.js!");
});
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Run the server
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// landing page changes
