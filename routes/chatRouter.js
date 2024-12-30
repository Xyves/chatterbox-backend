const chatRouter = require("express").Router();
const { chatsController } = require("../controllers/chatsController");
// Get 2 user chat
chatRouter.get("/", chatsController.getChats);

chatRouter.get("/:chat_id", chatsController.getChatById);
chatRouter.get("/:chat_id/messages", chatsController.getChatMessages);
chatRouter.get(
  "/:chat_id/messages/:message_id",
  chatsController.getChatMessageById
);

chatRouter.post("/", chatsController.createChat);
chatRouter.post("/:chat_id/messages", chatsController.createChatMessage);

module.exports = chatRouter;
