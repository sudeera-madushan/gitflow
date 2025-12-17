// Item Routes - defines API endpoints
const ItemController = require("../controllers/ItemController");
const { parseRequestBody } = require("../utils/requestParser");

class ItemRoutes {
  constructor() {
    this.controller = new ItemController();
  }

  // Route handler
  handleRequest(req, res) {
    const { method, url } = req;
    const urlParts = url.split("/").filter((part) => part);

    // Parse request body for POST, PUT, and DELETE requests
    if (method === "POST" || method === "PUT" || method === "DELETE") {
      parseRequestBody(req, () => {
        this.routeRequest(req, res, method, urlParts);
      });
    } else {
      this.routeRequest(req, res, method, urlParts);
    }
  }

  routeRequest(req, res, method, urlParts) {
    // GET /api/items
    if (
      method === "GET" &&
      urlParts.length === 2 &&
      urlParts[0] === "api" &&
      urlParts[1] === "items"
    ) {
      this.controller.getAllItems(req, res);
    }
    // GET /api/items/:id
    else if (
      method === "GET" &&
      urlParts.length === 3 &&
      urlParts[0] === "api" &&
      urlParts[1] === "items"
    ) {
      req.params = { id: urlParts[2] };
      this.controller.getItemById(req, res);
    }
    // POST /api/items
    else if (
      method === "POST" &&
      urlParts.length === 2 &&
      urlParts[0] === "api" &&
      urlParts[1] === "items"
    ) {
      this.controller.createItem(req, res);
    }
    // PUT /api/items/:id
    else if (
      method === "PUT" &&
      urlParts.length === 3 &&
      urlParts[0] === "api" &&
      urlParts[1] === "items"
    ) {
      req.params = { id: urlParts[2] };
      this.controller.updateItem(req, res);
    }
    // DELETE /api/items/bulk - Bulk delete items
    else if (
      method === "DELETE" &&
      urlParts.length === 3 &&
      urlParts[0] === "api" &&
      urlParts[1] === "items" &&
      urlParts[2] === "bulk"
    ) {
      this.controller.bulkDeleteItems(req, res);
    }
    // DELETE /api/items/:id
    else if (
      method === "DELETE" &&
      urlParts.length === 3 &&
      urlParts[0] === "api" &&
      urlParts[1] === "items"
    ) {
      req.params = { id: urlParts[2] };
      this.controller.deleteItem(req, res);
    }
    // 404 Not Found
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  }
}

module.exports = ItemRoutes;
