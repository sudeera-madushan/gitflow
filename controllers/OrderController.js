// Order Controller - handles HTTP requests and responses
const OrderRepository = require("../models/OrderRepository");

class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  // GET /api/orders - Get all orders
  getAllOrders(req, res) {
    try {
      const orders = this.orderRepository.findAll();
      this.sendResponse(res, 200, { orders, count: orders.length });
    } catch (error) {
      this.sendError(res, 500, "Failed to fetch orders", error);
    }
  }

  // GET /api/orders/:id - Get order by ID
  getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = this.orderRepository.findById(id);

      if (!order) {
        return this.sendError(res, 404, "Order not found");
      }

      this.sendResponse(res, 200, { order });
    } catch (error) {
      this.sendError(res, 500, "Failed to fetch order", error);
    }
  }

  // POST /api/orders - Create new order
  createOrder(req, res) {
    try {
      const { userId, items, status, shippingAddress } = req.body;

      // Validation
      if (!userId) {
        return this.sendError(res, 400, "UserId is required");
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return this.sendError(res, 400, "Items array is required and must not be empty");
      }

      // Validate items structure
      for (const item of items) {
        if (!item.itemId) {
          return this.sendError(res, 400, "Each item must have an itemId");
        }
        if (!item.quantity || item.quantity <= 0) {
          return this.sendError(res, 400, "Each item must have a valid quantity greater than 0");
        }
        if (item.price === undefined || isNaN(item.price) || item.price < 0) {
          return this.sendError(res, 400, "Each item must have a valid price");
        }
      }

      // Validate status if provided
      const validStatuses = ["pending", "processing", "completed", "cancelled"];
      if (status && !validStatuses.includes(status)) {
        return this.sendError(res, 400, `Status must be one of: ${validStatuses.join(", ")}`);
      }

      const order = this.orderRepository.create({
        userId,
        items,
        totalAmount: 0, // Will be calculated
        status: status || "pending",
        shippingAddress: shippingAddress || "",
      });

      this.sendResponse(res, 201, { order, message: "Order created successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to create order", error);
    }
  }

  // PUT /api/orders/:id - Update order
  updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { items, status, shippingAddress } = req.body;

      const order = this.orderRepository.findById(id);
      if (!order) {
        return this.sendError(res, 404, "Order not found");
      }

      // Validate status if provided
      if (status) {
        const validStatuses = ["pending", "processing", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
          return this.sendError(res, 400, `Status must be one of: ${validStatuses.join(", ")}`);
        }
      }

      // Validate items if provided
      if (items !== undefined) {
        if (!Array.isArray(items) || items.length === 0) {
          return this.sendError(res, 400, "Items must be a non-empty array");
        }

        for (const item of items) {
          if (!item.itemId) {
            return this.sendError(res, 400, "Each item must have an itemId");
          }
          if (!item.quantity || item.quantity <= 0) {
            return this.sendError(res, 400, "Each item must have a valid quantity greater than 0");
          }
          if (item.price === undefined || isNaN(item.price) || item.price < 0) {
            return this.sendError(res, 400, "Each item must have a valid price");
          }
        }
      }

      const updatedOrder = this.orderRepository.update(id, {
        items,
        status,
        shippingAddress,
      });

      this.sendResponse(res, 200, { order: updatedOrder, message: "Order updated successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to update order", error);
    }
  }

  // DELETE /api/orders/:id - Delete order
  deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = this.orderRepository.findById(id);

      if (!order) {
        return this.sendError(res, 404, "Order not found");
      }

      this.orderRepository.delete(id);
      this.sendResponse(res, 200, { message: "Order deleted successfully" });
    } catch (error) {
      this.sendError(res, 500, "Failed to delete order", error);
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

module.exports = OrderController;

