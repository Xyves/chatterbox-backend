const db = require("../db/query");
async function getChatWithMessages(req, res) {
  const { userId, user2Id } = req.body;
  const chat = await db.getChat(userId, user2Id);
  const messages = await db.getChatMessages(chat.id);
  res.json(messages);
}

async function getMessageById(req, res) {
  const { message_id } = req.params;
  const message = await db.getMessageById(message_id);
  res.json(message);
}

async function createMessage(req, res) {
  const { chat_id } = req.params;
  const time = Math.floor(Date.now() / 1000);
  const { id, user_id, content } = req.body;
  const message = await db.createMessage(chat_id, id, user_id, content, time);
  res.json(message);
}
async function getFriends(req, res) {
  const user_id = req.body.user_id;
  const friends = await db.fetchFriends(user_id);
  res.json(friends);
}
module.exports = {
  getChatWithMessages,
  getMessageById,
  createMessage,
  getFriends,
};
