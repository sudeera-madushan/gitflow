// User Routes - defines API endpoints
const UserController = require("../controllers/UserController");
const { parseRequestBody } = require("../utils/requestParser");

class UserRoutes {
  constructor() {
    this.controller = new UserController();
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
    // GET /api/users
    if (method === "GET" && urlParts.length === 2 && urlParts[0] === "api" && urlParts[1] === "users") {
      this.controller.getAllUsers(req, res);
    }
    // GET /api/users/:id
    else if (method === "GET" && urlParts.length === 3 && urlParts[0] === "api" && urlParts[1] === "users") {
      req.params = { id: urlParts[2] };
      this.controller.getUserById(req, res);
    }
    // POST /api/users
    else if (method === "POST" && urlParts.length === 2 && urlParts[0] === "api" && urlParts[1] === "users") {
      this.controller.createUser(req, res);
    }
    // PUT /api/users/:id
    else if (method === "PUT" && urlParts.length === 3 && urlParts[0] === "api" && urlParts[1] === "users") {
      req.params = { id: urlParts[2] };
      this.controller.updateUser(req, res);
    }
    // DELETE /api/users/:id
    else if (method === "DELETE" && urlParts.length === 3 && urlParts[0] === "api" && urlParts[1] === "users") {
      req.params = { id: urlParts[2] };
      this.controller.deleteUser(req, res);
    }
    // 404 Not Found
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  }
}

module.exports = UserRoutes;

