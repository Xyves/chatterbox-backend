const db = require("../db/query");
async function getChat(req, res) {
  const { userId, user2Id } = req.body;
  const chat = await db.getChat(userId, user2Id);
  res.json(chat);
}
async function getChatById(req, res) {
  const { chat_id } = req.params;
  const chat = db.getChatById(chat_id);
  res.json(chat);
}
async function getChatMessages(req, res) {
  const { chat_id } = req.params;
  const messages = await db.getChatMessages(chat_id);
  res.json(messages);
}
async function getMessageById(req, res) {
  const { message_id } = req.params;
  const message = await db.getMessageById(message_id);
  res.json(message);
}

async function createChat(req, res) {
  const { id, user1_id, user2_id } = req.body;
  const chat = await db.createChat(id, user1_id, user2_id);
  res.json(chat);
}
async function createMessage(req, res) {
  const { chat_id } = req.params;
  const time = Math.floor(Date.now() / 1000);
  const { id, user_id, content } = req.body;
  const message = await db.createMessage(chat_id, id, user_id, content, time);
  res.json(message);
}
module.exports = {
  getChat,
  getChatById,
  getChatMessages,
  getMessageById,
  createChat,
  createMessage,
};
