const Joi = require("joi");
const { colorRegex } = require("../../config/regex");
const { EVENT_TYPES } = require("../../config/constants");

const CreateEvent = Joi.object({
  title: Joi.string().min(4).max(100).required(),
  description: Joi.string().min(16).max(200),
  color: Joi.string().regex(colorRegex).required(),
  type: Joi.string()
    .required()
    .valid(...EVENT_TYPES),
  startAt: Joi.date().required().iso().less(Joi.ref("endAt")),
  endAt: Joi.date().required().iso(),
});

const UpdateEvent = Joi.object({
  title: Joi.string().min(4).max(100),
  description: Joi.string().min(16).max(200),
  color: Joi.string().regex(colorRegex),
  startAt: Joi.date().iso().less(Joi.ref("endAt")),
  endAt: Joi.date().iso(),
});

module.exports = { CreateEvent, UpdateEvent };
