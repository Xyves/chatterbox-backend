const express = require("express");
const session = require("express-session");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");

app.options("*", cors());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/chat", chatRouter);
app.use("/api", authRouter);
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use((req, res, next) => {
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
