const HttpStatus = require("http-status-codes").StatusCodes;
const calendarService = require("../services/calendar");

const mongoose = require("mongoose");
const geoip = require("geoip-lite");
const { getHolidaysByCountry } = require("../helpers/holiday-helper");
const logger = require("../../config/logger");
const {
  parseShowEventsParams,
} = require("../helpers/show-events-param-helper");

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

const getHolidays = async (req, res, next) => {
  const geo = geoip.lookup(req.ip || req.connection.remoteAddress);
  const country = geo && geo.country ? geo.country.toUpperCase() : "UA";
  const holidays = getHolidaysByCountry(country);
  return res.status(HttpStatus.OK).json({ holidays });
};

const createEvent = async (req, res, next) => {
  try {
    const event = await calendarService.createEvent(
      req.params.id,
      req.userId,
      req.body
    );

    return res.status(HttpStatus.CREATED).json({ event });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await calendarService.updateEvent(
      req.params.eid,
      req.calendarMember,
      req.body
    );

    return res.status(HttpStatus.OK).json({ event });
  } catch (err) {
    logger.error(`${err}`);
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    await calendarService.deleteEvent(
      req.params.id,
      req.params.eid,
      req.calendarMember
    );
    return res.status(HttpStatus.OK).json({});
  } catch (err) {
    next(err);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await calendarService.getCalendar(
      req.params.id,
      parseShowEventsParams(req.query)
    );
    return res.status(HttpStatus.OK).json({ events });
  } catch (err) {
    next(err);
  }
};

const getEventInfo = async (req, res, next) => {
  try {
    const event = await calendarService.getEvent(req.params.eid);
    return res.status(HttpStatus.OK).json({ event });
  } catch (err) {
    next(err);
  }
};

const inviteUser = async (req, res, next) => {
  try {
    await calendarService.sendInviteToCalendar(
      req.userId,
      req.params.id,
      req.body.email
    );
    return res.status(HttpStatus.OK).json({});
  } catch (err) {
    next(err);
  }
};

const confirmUserJoin = async (req, res, next) => {
  try {
    await calendarService.confirmUserJoin(req.body.token, req.userId);
    return res.status(HttpStatus.OK).json({});
  } catch (err) {
    next(err);
  }
};

const deleteCalendarUser = async (req, res, next) => {
  try {
    const memberMe = req.calendarMember;
    const memberId = req.body.memberId;

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    await calendarService.deleteUserFromCalendar(
      req.params.id,
      memberMe,
      memberId
    );
    return res.status(HttpStatus.OK).json({});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyCalendars,
  createCalendar,
  updateCalendar,
  getHolidays,
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventInfo,
  inviteUser,
  confirmUserJoin,
  deleteCalendarUser,
};
