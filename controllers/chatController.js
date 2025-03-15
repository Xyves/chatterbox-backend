const { uuid } = require("uuidv4");
const db = require("../db/query");
async function getChatMessages(req, res) {
  const { chat_id } = req.params;
  console.log(chat_id);
  try {
    const messages = await db.getChatMessages(chat_id);
    console.log("Fetched messeges are:", messages);
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
  const { sender_id, content } = req.body;
  console.log(sender_id);
  const message = await db.createMessage(chat_id, id, sender_id, content, time);
  console.log("Created message:", message);
  res.json(message);
}
async function getFriends(req, res) {
  try {
    const { user_nickname } = req.query;
    const { id } = await db.getUserByName(user_nickname);

    const friends = await db.fetchFriends(id);
    const friendsWithChats = await Promise.all(
      friends.map(async (friend) => {
        const chat_id = await db.getChatId(friend.id, id);
        return { ...friend, chat_id };
      })
    );

    res.json(friendsWithChats);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  getChatMessages,
  getMessageById,
  createMessage,
  getFriends,
};
