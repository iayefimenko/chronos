const express = require("express");
const auth = require("./auth");
const user = require("./user");
const calendar = require("./calendar");

const { jwtAuth } = require("../middlewares/jwt-auth");

const router = express.Router();

router.use("/auth", auth);
router.use("/users", jwtAuth, user);
router.use("/calendars", jwtAuth, calendar);

module.exports = router;
