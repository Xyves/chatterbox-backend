const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Chat
const getChat = (id_1, id_2) => {
  return prisma.chat.findUnique({
    where: { AND: [{ user1_id: id_1 }, { user2_id: id_2 }] },
  });
};
const createChat = (id, user1_id, user2_id) => {
  return prisma.chat.create({ data: { id, user1_id, user2_id } });
};

// Messages
const getChatMessages = async (chat_id) => {
  return prisma.message.findMany({
    where: { chat_id },
  });
};
const getMessageById = async (id) => {
  return prisma.message.findUnique({ where: { id } });
};
const createMessage = async (chat_id, id, user_id, content, time) => {
  return prisma.message.create({
    data: { chat_id, id, sender_id: user_id, content, time },
  });
};

// USER
const getUserByName = (nickname) => {
  return prisma.user.findUnique({
    where: nickname,
    select: {
      id: true,
      nickname: true,
      email: true,
      bio: true,
      avatar_url: true,
    },
  });
};
const createUser = async (nickname, hashedPassword, email, bio, avatar_url) => {
  return prisma.user.create({
    data: {
      nickname,
      hashedPassword,
      email,
      bio,
      avatar_url,
    },
  });
};
const getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nickname: true,
      email: true,
      bio: true,
      avatar_url: true,
    },
  });
};
module.exports = {
  createUser,
  getUserByName,
  getUserById,
  createChat,
  getChat,
  getChatMessages,
  getMessageById,
  createMessage,
};
