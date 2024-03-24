const Joi = require("joi");

const CreateCalendar = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  description: Joi.string().min(16).max(200),
});

const UpdateCalendar = Joi.object({
  name: Joi.string().min(4).max(100),
  description: Joi.string().min(16).max(200),
});

const InviteUser = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = { CreateCalendar, UpdateCalendar, InviteUser };
