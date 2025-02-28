const { uuid } = require("uuidv4");
const db = require("../db/query");
async function getChatMessages(req, res) {
  const { user1_id, user2_id } = req.body;
  const { chat_id } = req.params;
  try {
    const messages = await db.getChatMessages(chat_id, user1_id, user2_id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat messages" });
  }
}

async function getMessageById(req, res) {
  const { message_id } = req.params;
  const message = await db.getMessageById(message_id);
  res.json(message);
}

async function createMessage(req, res) {
  const { chat_id } = req.params;
  const time = Math.floor(Date.now() / 1000);
  const id = uuid();
  console.log(time);
  const { user_id, content } = req.body;
  const message = await db.createMessage(chat_id, id, user_id, content, time);
  console.log("Created message:", message);
  res.json(message);
}
async function getFriends(req, res) {
  const { user_nickname } = req.query;
  const { id } = db.getUserByName(user_nickname);
  const friends = await db.fetchFriends(id);
  const friendsWithChats = await Promise.all(
    friends.map(async (friend) => {
      const chat_id = await db.getChatId(friend.id, id);
      return { ...friend, chat_id };
    })
  );

  res.json(friendsWithChats);
}
module.exports = {
  getChatMessages,
  getMessageById,
  createMessage,
  getFriends,
};
