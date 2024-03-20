const HttpStatus = require("http-status-codes").StatusCodes;
const calendarService = require("../services/calendar");

const getMyCalendars = async (req, res, next) => {
  const calendars = await calendarService.getMyCalendars(req.userId);
  return res.status(HttpStatus.OK).json({ calendars });
};

const createCalendar = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const calendar = await calendarService.createCalendar(req.userId, {
      name,
      description,
      isDefault: false,
    });

    return res.status(HttpStatus.CREATED).json({ calendar });
  } catch (err) {
    next(err);
  }
};

const updateCalendar = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Only calendar owner can update calendar
    if (req.calendarMember.role !== "owner")
      return res.status(HttpStatus.FORBIDDEN);

    const calendar = await calendarService.updateCalendar(req.params.id, {
      name,
      description,
    });
    return res.status(HttpStatus.OK).json({ calendar });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyCalendars, createCalendar, updateCalendar };
