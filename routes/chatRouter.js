const { Router } = require("express");
const chatRouter = Router();
const chatsController = require("../controllers/chatController");
const { verifyToken } = require("../controllers/authController");

chatRouter.get("/friends", verifyToken, chatsController.getFriends);
chatRouter.get(
  "/:chat_id/message",
  verifyToken,
  chatsController.getChatMessages
);
chatRouter.post("/:chat_id/message", chatsController.createMessage);

module.exports = chatRouter;
