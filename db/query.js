const { PrismaClient } = require("@prisma/client");
const { uuid } = require("uuidv4");
const prisma = new PrismaClient();

// Chat
const getChat = async (id_1, id_2) => {
  let chat = await prisma.chat.findFirst({
    where: {
      OR: [
        { AND: [{ user1_id: id_1 }, { user2_id: id_2 }] },
        { AND: [{ user1_id: id_2 }, { user2_id: id_1 }] },
      ],
    },
  });

  if (!chat) {
    const id = uuid();
    chat = await prisma.chat.create({
      data: {
        id: id,
        user1_id: id_1,
        user2_id: id_2,
      },
    });
  }

  return chat;
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
const getUserByName = (username) => {
  return prisma.user.findUnique({
    where: { nickname: username },
    select: {
      id: true,
      password: true,
      nickname: true,
      email: true,
      bio: true,
      avatar_url: true,
    },
  });
};
const createUser = async (
  nickname,
  hashedPassword,
  email,
  bio = null,
  avatar_url = null
) => {
  return prisma.user.create({
    data: {
      nickname,
      password: hashedPassword,
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
const fetchFriends = (user_id) => {
  return prisma.user.findMany({
    where: {
      id: {
        not: user_id,
      },
    },
    select: { id: true, nickname: true, bio: true, avatar_url: true },
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
  fetchFriends,
};
