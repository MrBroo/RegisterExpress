const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registerDate: { type: Date, default: new Date() },
  lastLoginDate: { type: Date, default: null },
  isBlocked: { type: Boolean, default: false },
});

module.exports = model("User", User);
