const authRouter = require("express").Router();
const { authController } = require("../controllers/authController");
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.signup);
authRouter.get("/logout", authController.logout);
authRouter.get("/:id", authController.getUser);

module.exports = authRouter;
