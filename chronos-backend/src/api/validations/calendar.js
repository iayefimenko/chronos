const Joi = require("joi");

const CreateCalendar = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  description: Joi.string().min(16).max(200),
});

const UpdateCalendar = Joi.object({
  name: Joi.string().min(4).max(100),
  description: Joi.string().min(16).max(200),
});

module.exports = { CreateCalendar, UpdateCalendar };
