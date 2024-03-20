const HttpStatus = require("http-status-codes").StatusCodes;
const User = require("../models/user");
const Calendar = require("../models/calendar");
const CalendarUser = require("../models/calendar-user");

const createCalendar = async (userId, calendarData) => {
  const user = await User.findById(userId);

  if (!user) {
    // Something wrong with token. User should log in
    throw { statusCode: HttpStatus.FORBIDDEN, message: "Token is invalid" };
  }

  let calendarUser = new CalendarUser({
    user,
    role: "owner",
  });

  calendarUser = await calendarUser.save();

  const calendar = new Calendar({
    ...calendarData,
    events: [],
    calendarUsers: [calendarUser._id],
  });

  return await calendar.save();
};

const getMyCalendars = async (userId) => {
  const calendarMembers = await CalendarUser.find({ user: userId });
  const memberIds = calendarMembers.map((calendarUser) => calendarUser._id);
  const calendars = await Calendar.find({
    calendarUsers: { $in: memberIds },
  });
  return calendars;
};

const updateCalendar = async (id, calendarData) => {
  try {
    
    const updatedCalendar = await Calendar.findOneAndUpdate(
      {
        _id: id,
      },
      calendarData,
      { new: true }
    );
    return updatedCalendar;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createCalendar,
  getMyCalendars,
  updateCalendar,
};
