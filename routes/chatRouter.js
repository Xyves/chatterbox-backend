const chatRouter = require("express").Router();
const { chatsController } = require("../controllers/chatsController");
// Get chat between 2 users
chatRouter.get("/", chatsController.getChat);

chatRouter.get("/:chat_id", chatsController.getChatById);
chatRouter.get("/:chat_id/messages", chatsController.getChatMessages);
chatRouter.get("/messages/:message_id", chatsController.getMessageById);

chatRouter.post("/", chatsController.createChat);
chatRouter.post("/:chat_id/messages", chatsController.createChatMessage);

module.exports = chatRouter;
