const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const router = require("../api/routes");
const logger = require("./logger");
const sendEmail = require("../api/helpers/email-helper");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization, Set-Cookie",
  })
);

app.use("/api/v1", router);

app.use((req, res, next) => {
  return res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : res.statusCode;

  logger.error(`CODE: ${statusCode}, msg: ${err.message}, stack: ${err.stack}`);
  res.status(statusCode).json({
    message: err.message,
  });
});

module.exports = app;
