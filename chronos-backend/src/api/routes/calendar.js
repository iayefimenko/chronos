const express = require("express");
const calendarController = require("../controllers/calendar");
const cSchema = require("../validations/calendar");
const eSchema = require("../validations/event");
const aSchema = require("../validations/auth");
const { validate } = require("../middlewares/validate");
const { calendarGuard } = require("../middlewares/calendar-guard");
const { eventGuard } = require("../middlewares/event-guard");

const router = express.Router();

router.get("/", calendarController.getMyCalendars);
router.get("/holidays", calendarController.getHolidays);
router.post(
  "/",
  validate(cSchema.CreateCalendar),
  calendarController.createCalendar
);

router.delete("/:id", calendarGuard, calendarController.deleteCalendar);

router.patch(
  "/:id",
  validate(cSchema.UpdateCalendar),
  calendarGuard,
  calendarController.updateCalendar
);

router.post(
  "/:id/receive-events",
  calendarGuard,
  validate(cSchema.GetEvents),
  calendarController.getEvents
);

//invite user to calendar
router.post(
  "/:id/inite",
  calendarGuard,
  validate(cSchema.InviteUser),
  calendarController.inviteUser
);

//Confirm user join
router.post(
  "/confirm-join",
  validate(aSchema.TokenVerification),
  calendarController.confirmUserJoin
);

//delete calendar user
router.delete(
  "/:id/delete-user",
  calendarGuard,
  calendarController.deleteCalendarUser
);

// events
router.post(
  "/:id/event",
  validate(eSchema.CreateEvent),
  calendarGuard,
  calendarController.createEvent
);

router.patch(
  "/:id/event/:eid",
  validate(eSchema.UpdateEvent),
  calendarGuard,
  eventGuard,
  calendarController.updateEvent
);

router.delete(
  "/:id/event/:eid",
  calendarGuard,
  eventGuard,
  calendarController.deleteEvent
);

router.get(
  "/:id/event/:eid",
  calendarGuard,
  eventGuard,
  calendarController.getEventInfo
);

module.exports = router;
