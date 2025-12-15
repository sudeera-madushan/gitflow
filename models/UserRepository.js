// User Repository - handles data persistence
const User = require("./User");

class UserRepository {
  constructor() {
    // In-memory storage (can be replaced with database)
    this.users = [];
    this.nextId = 1;
  }

  // Create a new user
  create(userData) {
    const user = new User(this.nextId++, userData.name, userData.email, userData.age);
    this.users.push(user);
    return user;
  }

  // Get all users
  findAll() {
    return this.users;
  }

  // Get user by ID
  findById(id) {
    return this.users.find((user) => user.id === parseInt(id));
  }

  // Update user
  update(id, userData) {
    const user = this.findById(id);
    if (user) {
      user.update(userData);
      return user;
    }
    return null;
  }

  // Delete user
  delete(id) {
    const index = this.users.findIndex((user) => user.id === parseInt(id));
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
    return null;
  }

  // Check if email exists
  findByEmail(email) {
    return this.users.find((user) => user.email === email);
  }
}

module.exports = UserRepository;

