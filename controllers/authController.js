const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByName,
  getUserById,
  updateUser,
} = require("../db/query");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
async function login(req, res) {
  try {
    const { password, nickname } = req.body;

    const user = await getUserByName(nickname);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication failed: user not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const secret = process.env.SECRET_KEY;
    if (!secret) {
      console.error("Secret key is not defined in environment variables");
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const token = jwt.sign(
        { user: { id: user.id, nickname: user.nickname } },
        secret,
        { expiresIn: "60m" }
      );

      res.json({ userToken: token, id: user.id, nickname: user.nickname });
    } catch (err) {
      console.error("Error generating token:", err);
      return res.status(500).json({ error: "Error generating token" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
}
async function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/blogs");
  });
}
async function signup(req, res) {
  const { nickname, password, email } = req.body;
  if (!nickname || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await createUser(nickname, hashedPassword, email);

    const token = jwt.sign(
      {
        id: user.id,
        nickname: nickname,
        email,
        password: hashedPassword,
      },
      process.env.SECRET_KEY,
      { expiresIn: "60m" }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message || "Error creating user" });
  }
}
async function getUser(req, res) {
  const { id } = req.params;
  const user = await getUserById(id);
  res.json(user);
}
function createUserValidation() {
  return [
    body("nickname")
      .isLength({ min: 3, max: 20 })
      .withMessage("username must be between 3 and 20 characters")
      .not()
      .contains(" ")
      .withMessage("Username should not contain spaces"),

    body("password")
      .isLength({ min: 5, max: 15 })
      .withMessage("Password must be between 5 and 15 characters")
      .notEmpty()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,15}$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ];
}
function validateMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
async function getProfile(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("No token found, access denied");
    return res.status(401).send("Access Denied");
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("Decoded JWT:", verifiedUser);
    if (!verifiedUser) {
      console.error("User not found in database");
      return res.status(404).send("User not found");
    }
    const user = await getUserById(verifiedUser.user.id);

    res.json(user);
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
};
async function getUser(req, res) {
  const { id } = req.params;
  const user = await getUserById(id);
  res.json(user);
}
async function updateUserController(req, res) {
  const { email, bio, avatar_url, id } = req.body;
  const user = await updateUser(email, bio, avatar_url, id);
  res.status(200).json(user);
}
module.exports = {
  login,
  getProfile,
  signup,
  validateMiddleware,
  createUserValidation,
  getUser,
  logout,
  verifyToken,
  updateUserController,
};
