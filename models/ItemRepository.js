// Item Repository - handles data persistence
const Item = require("./Item");

class ItemRepository {
  constructor() {
    // In-memory storage (can be replaced with database)
    this.items = [];
    this.nextId = 1;
  }

  // Create a new item
  create(itemData) {
    const item = new Item(
      this.nextId++,
      itemData.name,
      itemData.description,
      itemData.price,
      itemData.category
    );
    this.items.push(item);
    return item;
  }

  // Get all items
  findAll() {
    return this.items;
  }

  // Get item by ID
  findById(id) {
    return this.items.find((item) => item.id === parseInt(id));
  }

  // Update item
  update(id, itemData) {
    const item = this.findById(id);
    if (item) {
      item.update(itemData);
      return item;
    }
    return null;
  }

  // Delete item
  delete(id) {
    const index = this.items.findIndex((item) => item.id === parseInt(id));
    if (index !== -1) {
      return this.items.splice(index, 1)[0];
    }
    return null;
  }

  // Find items by category
  findByCategory(category) {
    return this.items.filter((item) => item.category === category);
  }

  // Find items by name (case-insensitive partial match)
  findByName(name) {
    const searchName = name.toLowerCase();
    return this.items.filter((item) => item.name.toLowerCase().includes(searchName));
  }
}

module.exports = ItemRepository;

