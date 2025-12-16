// Order Model
class Order {
  constructor(id, userId, items, totalAmount, status, shippingAddress) {
    this.id = id;
    this.userId = userId;
    this.items = items || []; // Array of { itemId, quantity, price }
    this.totalAmount = totalAmount || 0;
    this.status = status || "pending"; // pending, processing, completed, cancelled
    this.shippingAddress = shippingAddress || "";
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromObject(obj) {
    const order = new Order(
      obj.id,
      obj.userId,
      obj.items,
      obj.totalAmount,
      obj.status,
      obj.shippingAddress
    );
    order.createdAt = obj.createdAt || order.createdAt;
    order.updatedAt = obj.updatedAt || order.updatedAt;
    return order;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      totalAmount: this.totalAmount,
      status: this.status,
      shippingAddress: this.shippingAddress,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(data) {
    if (data.items !== undefined) this.items = data.items;
    if (data.totalAmount !== undefined) this.totalAmount = data.totalAmount;
    if (data.status !== undefined) this.status = data.status;
    if (data.shippingAddress !== undefined) this.shippingAddress = data.shippingAddress;
    this.updatedAt = new Date().toISOString();
  }

  calculateTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}

module.exports = Order;

