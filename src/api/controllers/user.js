const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const userService = require("../services/user");

const me = async (req, res, next) => {
  const user = await userService.findOne({ _id: req.userId });
  return res.status(HttpStatus.OK).json({ user });
};

module.exports = { me };
