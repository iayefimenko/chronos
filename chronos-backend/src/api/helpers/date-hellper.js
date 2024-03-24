const {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addWeeks,
  addMonths,
  addYears,
} = require("date-fns");

const {
  CALENDAR_PROJ_WEEK,
  CALENDAR_PROJ_MONTH,
  CALENDAR_PROJ_YEAR,
} = require("../../config/constants");

const receiveStartDateFn = {
  [CALENDAR_PROJ_WEEK]: (date, offset) =>
    startOfWeek(addWeeks(date, offset), {
      weekStartsOn: 1,
    }),
  [CALENDAR_PROJ_MONTH]: (date, offset) =>
    startOfMonth(addMonths(date, offset)),
  [CALENDAR_PROJ_YEAR]: (date, offset) => startOfYear(addYears(date, offset)),
};

const receiveEndDateFn = {
  [CALENDAR_PROJ_WEEK]: (startOfCurrentWeek) =>
    endOfWeek(startOfCurrentWeek, { weekStartsOn: 1 }),
  [CALENDAR_PROJ_MONTH]: (startOfCurrentMonth) =>
    endOfMonth(startOfCurrentMonth),
  [CALENDAR_PROJ_YEAR]: (startOfCurrentYear) => endOfYear(startOfCurrentYear),
};

function getDatePerid(projection, offset) {
  const currentDate = new Date();

  const startDate = receiveStartDateFn[projection](currentDate, offset);
  startDate.setHours(0, 0, 0, 0);

  const offs = startDate.getTimezoneOffset();
  startDate.setMinutes(startDate.getMinutes() - offs);

  const endDate = receiveEndDateFn[projection](startDate);
  endDate.setHours(23, 59, 59, 999);
  endDate.setMinutes(endDate.getMinutes() - offs);
  return [startDate, endDate];
}

module.exports = { getDatePerid };
