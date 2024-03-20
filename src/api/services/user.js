const HttpStatus = require("http-status-codes").StatusCodes;
const User = require("../models/user");

const findOne = async (filter) => {
  return await User.findOne(filter).select("-password");
};

module.exports = { findOne };
