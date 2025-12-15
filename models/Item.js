// Item Model
class Item {
  constructor(id, name, description, price, category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromObject(obj) {
    const item = new Item(obj.id, obj.name, obj.description, obj.price, obj.category);
    item.createdAt = obj.createdAt || item.createdAt;
    item.updatedAt = obj.updatedAt || item.updatedAt;
    return item;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.price !== undefined) this.price = data.price;
    if (data.category !== undefined) this.category = data.category;
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Item;

