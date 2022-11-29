const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, username, email) => {
  const payload = {
    id,
    username,
    email,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Incorrect request", errors });
      }
      const { username, email, password } = req.body;
      const candidateUsername = await User.findOne({ username });
      const candidateEmail = await User.findOne({ email });
      if (candidateUsername) {
        return res.status(400).json({ message: "User already exists" });
      } else if (candidateEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ username, email, password: hashPassword });
      await user.save();
      return res.json({ message: "User was created" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error!" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `User ${username} not found` });
      } else if (user.isBlocked) {
        return res.status(403).json({ message: `User ${username} blocked` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }
      await User.findByIdAndUpdate(
        user._id,
        { $set: { lastLoginDate: new Date() } },
        { new: true }
      );
      const token = generateAccessToken(user.id, user.username, user.email);
      return res.json({
        _id: user._id,
        token,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error!" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {}
  }

  async blockUser(req, res) {
    try {
      const _id = req.params.id;
      await User.findByIdAndUpdate({ _id }, { isBlocked: true });
      return res.json({ message: "User blocked successfully" });
    } catch (e) {
      console.log(e);
      res.json({ message: "Block error!" });
    }
  }

  async unBlockUser(req, res) {
    try {
      const _id = req.params.id;
      await User.findByIdAndUpdate({ _id }, { isBlocked: false });
      return res.json({ message: "User blocked successfully" });
    } catch (e) {
      console.log(e);
      res.json({ message: "Block error!" });
    }
  }

  async deleteUser(req, res, next) {
    try {
      User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
          return res.json({ message: "User deleted successfully" });
        } else {
          console.log(err);
        }
      });
    } catch (e) {
      console.log(e);
      res.json({ message: "Delete error!" });
    }
  }
}
module.exports = new authController();
