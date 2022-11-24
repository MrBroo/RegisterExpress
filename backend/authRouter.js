const Router = require("express");
const { check } = require("express-validator");
const router = new Router();
const controller = require("./authController");
const authMiddleware = require("./middleware/authMiddleware");

router.post("/registration", controller.registration, [
  check("username", "Username can not be empty").notEmpty(),
  check("email", "Email can not be empty").isEmail(),
  check(
    "password",
    "password should not be less than 4 and more than 18 characters"
  ).isLength({ min: 4, max: 18 }),
]);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
router.delete("/users/delete/:id", controller.deleteUser);

module.exports = router;
