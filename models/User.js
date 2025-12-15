// User Model
class User {
  constructor(id, name, email, age) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromObject(obj) {
    const user = new User(obj.id, obj.name, obj.email, obj.age);
    user.createdAt = obj.createdAt || user.createdAt;
    user.updatedAt = obj.updatedAt || user.updatedAt;
    return user;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.age !== undefined) this.age = data.age;
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = User;

