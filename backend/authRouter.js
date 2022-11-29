const Router = require("express");
const { check } = require("express-validator");
const router = new Router();
const controller = require("./authController");
const authMiddleware = require("./middleware/authMiddleware");

router.post("/registration", controller.registration, [
  check("username", "Username can not be empty").notEmpty(),
  check("email", "Email can not be empty").isEmail(),
]);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
router.delete("/users/delete/:id", controller.deleteUser);
router.put("/users/block/:id", controller.blockUser);
router.put("/users/unblock/:id", controller.unBlockUser);

module.exports = router;
