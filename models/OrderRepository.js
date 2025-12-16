// Order Repository - handles data persistence
const Order = require("./Order");

class OrderRepository {
  constructor() {
    // In-memory storage (can be replaced with database)
    this.orders = [];
    this.nextId = 1;
  }

  // Create a new order
  create(orderData) {
    const order = new Order(
      this.nextId++,
      orderData.userId,
      orderData.items,
      orderData.totalAmount,
      orderData.status,
      orderData.shippingAddress
    );
    
    // Calculate total if not provided
    if (!orderData.totalAmount && order.items.length > 0) {
      order.totalAmount = order.calculateTotal();
    }
    
    this.orders.push(order);
    return order;
  }

  // Get all orders
  findAll() {
    return this.orders;
  }

  // Get order by ID
  findById(id) {
    return this.orders.find((order) => order.id === parseInt(id));
  }

  // Update order
  update(id, orderData) {
    const order = this.findById(id);
    if (order) {
      order.update(orderData);
      
      // Recalculate total if items changed
      if (orderData.items !== undefined) {
        order.totalAmount = order.calculateTotal();
      }
      
      return order;
    }
    return null;
  }

  // Delete order
  delete(id) {
    const index = this.orders.findIndex((order) => order.id === parseInt(id));
    if (index !== -1) {
      return this.orders.splice(index, 1)[0];
    }
    return null;
  }

  // Find orders by user ID
  findByUserId(userId) {
    return this.orders.filter((order) => order.userId === parseInt(userId));
  }

  // Find orders by status
  findByStatus(status) {
    return this.orders.filter((order) => order.status === status);
  }
}

module.exports = OrderRepository;

