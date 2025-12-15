// Item Controller - handles HTTP requests and responses
const ItemRepository = require("../models/ItemRepository");

class ItemController {
  constructor() {
    this.itemRepository = new ItemRepository();
  }

  // GET /api/items - Get all items
  getAllItems(req, res) {
    try {
      const items = this.itemRepository.findAll();
      this.sendResponse(res, 200, { items, count: items.length });
    } catch (error) {
      this.sendError(res, 500, "Failed to fetch items", error);
    }
  }

  // GET /api/items/:id - Get item by ID
  getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = this.itemRepository.findById(id);

      if (!item) {
        return this.sendError(res, 404, "Item not found");
      }

      this.sendResponse(res, 200, { item });
    } catch (error) {
      this.sendError(res, 500, "Failed to fetch item", error);
    }
  }

  // POST /api/items - Create new item
  createItem(req, res) {
    try {
      const { name, description, price, category } = req.body;

      // Validation
      if (!name) {
        return this.sendError(res, 400, "Name is required");
      }

      if (price !== undefined && (isNaN(price) || price < 0)) {
        return this.sendError(res, 400, "Price must be a valid positive number");
      }

      const item = this.itemRepository.create({ name, description, price, category });
      this.sendResponse(res, 201, { item, message: "Item created successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to create item", error);
    }
  }

  // PUT /api/items/:id - Update item
  updateItem(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, category } = req.body;

      const item = this.itemRepository.findById(id);
      if (!item) {
        return this.sendError(res, 404, "Item not found");
      }

      // Validate price if provided
      if (price !== undefined && (isNaN(price) || price < 0)) {
        return this.sendError(res, 400, "Price must be a valid positive number");
      }

      const updatedItem = this.itemRepository.update(id, { name, description, price, category });
      this.sendResponse(res, 200, { item: updatedItem, message: "Item updated successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to update item", error);
    }
  }

  // DELETE /api/items/:id - Delete item
  deleteItem(req, res) {
    try {
      const { id } = req.params;
      const item = this.itemRepository.findById(id);

      if (!item) {
        return this.sendError(res, 404, "Item not found");
      }

      this.itemRepository.delete(id);
      this.sendResponse(res, 200, { message: "Item deleted successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to delete item", error);
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

module.exports = ItemController;

