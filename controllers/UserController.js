// User Controller - handles HTTP requests and responses
const UserRepository = require("../models/UserRepository");

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // GET /api/users - Get all users
  getAllUsers(req, res) {
    try {
      const users = this.userRepository.findAll();
      this.sendResponse(res, 200, { users, count: users.length });
    } catch (error) {
      this.sendError(res, 500, "Failed to fetch users", error);
    }
  }

  // GET /api/users/:id - Get user by ID
  getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = this.userRepository.findById(id);

      if (!user) {
        return this.sendError(res, 404, "User not found");
      }

      this.sendResponse(res, 200, { user });
    } catch (error) {
      this.sendError(res, 500, "Failed to fetch user", error);
    }
  }

  // POST /api/users - Create new user
  createUser(req, res) {
    try {
      const { name, email, age } = req.body;

      // Validation
      if (!name || !email) {
        return this.sendError(res, 400, "Name and email are required");
      }

      if (this.userRepository.findByEmail(email)) {
        return this.sendError(res, 409, "Email already exists");
      }

      const user = this.userRepository.create({ name, email, age });
      this.sendResponse(res, 201, { user, message: "User created successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to create user", error);
    }
  }

  // PUT /api/users/:id - Update user
  updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, age } = req.body;

      const user = this.userRepository.findById(id);
      if (!user) {
        return this.sendError(res, 404, "User not found");
      }

      // Check if email is being changed and already exists
      if (email && email !== user.email && this.userRepository.findByEmail(email)) {
        return this.sendError(res, 409, "Email already exists");
      }

      const updatedUser = this.userRepository.update(id, { name, email, age });
      this.sendResponse(res, 200, { user: updatedUser, message: "User updated successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to update user", error);
    }
  }

  // DELETE /api/users/:id - Delete user
  deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = this.userRepository.findById(id);

      if (!user) {
        return this.sendError(res, 404, "User not found");
      }

      this.userRepository.delete(id);
      this.sendResponse(res, 200, { message: "User deleted successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to delete user", error);
    }
  }

  // Helper method to send success response
  sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  // Helper method to send error response
  sendError(res, statusCode, message, error = null) {
    const response = { error: message };
    if (error && process.env.NODE_ENV === "development") {
      response.details = error.message;
    }
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  }
}

module.exports = UserController;

