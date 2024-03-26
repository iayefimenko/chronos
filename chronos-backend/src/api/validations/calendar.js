const Joi = require("joi");
const { EVENT_TYPES } = require("../../config/constants");

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

const GetEvents = Joi.object({
  startAt: Joi.date().required().iso().less(Joi.ref("endAt")),
  endAt: Joi.date().required().iso(),
  show: Joi.array().items(Joi.string().valid(...EVENT_TYPES)),
});

module.exports = { CreateCalendar, UpdateCalendar, InviteUser, GetEvents };
