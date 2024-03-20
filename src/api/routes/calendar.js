const express = require("express");
const calendarController = require("../controllers/calendar");
const vSchema = require("../validations/calendar");
const { validate } = require("../middlewares/validate");
const { calendarGuard } = require("../middlewares/calendar-guard");

const router = express.Router();

router.get("/", calendarController.getMyCalendars);
router.post(
  "/",
  validate(vSchema.CreateCalendar),
  calendarController.createCalendar
);

router.patch(
  "/:id",
  validate(vSchema.UpdateCalendar),
  calendarGuard,
  calendarController.updateCalendar
);

module.exports = router;
