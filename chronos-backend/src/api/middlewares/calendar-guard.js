const HttpStatus = require("http-status-codes").StatusCodes;
const mongoose = require("mongoose");
const Calendar = require("../models/calendar");

async function calendarGuard(req, res, next) {
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const calendar = await Calendar.findById(req.params.id).populate(
    "calendarUsers"
  );
  if (!calendar) res.sendStatus(HttpStatus.FORBIDDEN);

  const me = calendar.calendarUsers.find(
    (m) => m.user._id.toString() === userId
  );
  if (!me) return res.sendStatus(HttpStatus.FORBIDDEN);
  req.calendarMember = me;

  next();
}

module.exports = { calendarGuard };
