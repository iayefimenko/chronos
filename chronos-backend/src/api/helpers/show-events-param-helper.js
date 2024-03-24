const {
  CALENDAR_PROJ_MONTH,
  CALENDAR_PROJ_WEEK,
  CALENDAR_PROJ_YEAR,
  EVENT_TYPES,
} = require("../../config/constants");
const { getDatePerid } = require("./date-hellper");

const parseShowEventsParams = (params) => {
  const { projection, offset, show } = params;
  const proj = [CALENDAR_PROJ_MONTH, CALENDAR_PROJ_WEEK, CALENDAR_PROJ_YEAR];
  const settings = {};

  settings.projection =
    projection && proj.includes(projection) ? projection : CALENDAR_PROJ_MONTH;

  settings.show = show ? EVENT_TYPES.filter((ev) => show.includes(ev)) : [];

  const offst = parseInt(offset);
  settings.offset = offst ? offst : 0;

  const [startDate, endDate] = getDatePerid(
    settings.projection,
    settings.offset
  );

  return { ...settings, startDate, endDate };
};

module.exports = { parseShowEventsParams };
