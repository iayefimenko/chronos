const Holidays = require("date-holidays");

const getHolidaysByCountry = (countryCode) => {
  const holidays = new Holidays(countryCode || "US");

  const date = new Date();
  return holidays.getHolidays(date.getFullYear());
};

module.exports = { getHolidaysByCountry };
