const HttpStatus = require("http-status-codes").StatusCodes;
const mongoose = require("mongoose");
const Calendar = require("../models/calendar");

async function eventGuard(req, res, next) {
  const calendarId = req.params.id;
  const eventId = req.params.eid;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const calendar = await Calendar.findById(calendarId);

  if (!calendar.events.includes(eventId)) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }
  next();
}

module.exports = { eventGuard };
