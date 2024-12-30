async function getChat(req, res) {
  const { userId, user2Id } = req.body;
  const chat = await db.getChat(userId, user2Id);
  res.json(chat);
}
async function getChatById(req, res) {
  const { chat_id } = req.params;
  const chat = await db.getChatById(chat_id);
  res.json(chat);
}
async function getChatMessages(req, res) {}
async function getChatMessageByMessageId(req, res) {}
async function createChat(req, res) {}
async function createMessageInChat(req, res) {}
