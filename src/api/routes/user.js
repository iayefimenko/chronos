const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

router.get("/me", userController.me);

module.exports = router;
