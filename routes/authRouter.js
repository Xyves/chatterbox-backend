const authRouter = require("express").Router();
const authController = require("../controllers/authController");
authRouter.post("/auth/login", authController.login);
authRouter.post(
  "/auth/register",
  authController.createUserValidation,
  authController.validateMiddleware,
  authController.signup
);
authRouter.get("/auth/logout", authController.logout);
authRouter.get("/user/me", authController.getProfile);
authRouter.get("/user/:id", authController.getUser);

module.exports = authRouter;
