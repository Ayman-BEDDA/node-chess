const { Router } = require("express");
const UserService = require("../services/user");

const router = Router();

const SecurityController = require("../controllers/security")(
  new UserService()
);

router.post("/login", SecurityController.login);
router.post("/register", SecurityController.register);
router.get("/logout", SecurityController.logout);
router.get("/verify/:token", SecurityController.verify);
router.post("/forgot-password", SecurityController.forgotPassword);
router.post("/reset-password/:token", SecurityController.resetPassword);

module.exports = router;
