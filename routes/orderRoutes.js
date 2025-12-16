// Order Routes - defines API endpoints
const OrderController = require("../controllers/OrderController");
const { parseRequestBody } = require("../utils/requestParser");

class OrderRoutes {
  constructor() {
    this.controller = new OrderController();
  }

  // Route handler
  handleRequest(req, res) {
    const { method, url } = req;
    const urlParts = url.split("/").filter((part) => part);

    // Parse request body for POST and PUT requests
    if (method === "POST" || method === "PUT") {
      parseRequestBody(req, () => {
        this.routeRequest(req, res, method, urlParts);
      });
    } else {
      this.routeRequest(req, res, method, urlParts);
    }
  }

  routeRequest(req, res, method, urlParts) {
    // GET /api/orders
    if (method === "GET" && urlParts.length === 2 && urlParts[0] === "api" && urlParts[1] === "orders") {
      this.controller.getAllOrders(req, res);
    }
    // GET /api/orders/:id
    else if (method === "GET" && urlParts.length === 3 && urlParts[0] === "api" && urlParts[1] === "orders") {
      req.params = { id: urlParts[2] };
      this.controller.getOrderById(req, res);
    }
    // POST /api/orders
    else if (method === "POST" && urlParts.length === 2 && urlParts[0] === "api" && urlParts[1] === "orders") {
      this.controller.createOrder(req, res);
    }
    // PUT /api/orders/:id
    else if (method === "PUT" && urlParts.length === 3 && urlParts[0] === "api" && urlParts[1] === "orders") {
      req.params = { id: urlParts[2] };
      this.controller.updateOrder(req, res);
    }
    // DELETE /api/orders/:id
    else if (method === "DELETE" && urlParts.length === 3 && urlParts[0] === "api" && urlParts[1] === "orders") {
      req.params = { id: urlParts[2] };
      this.controller.deleteOrder(req, res);
    }
    // 404 Not Found
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  }
}

module.exports = OrderRoutes;

