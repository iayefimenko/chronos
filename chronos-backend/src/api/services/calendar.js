const HttpStatus = require("http-status-codes").StatusCodes;
const User = require("../models/user");
const Calendar = require("../models/calendar");
const CalendarUser = require("../models/calendar-user");
const Event = require("../models/event");
const { execEventAction } = require("../helpers/user-event-permission-helper");

const jwt = require("jsonwebtoken");
const {
  sendEmail,
  INVITE_TO_CALENDAR_TEMPLATE,
} = require("../helpers/email-helper");
const { jwtVerifyAsync } = require("../helpers/jwt-helper");

const invTokens = new Map();

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

const createEvent = async (calendarId, userId, eventData) => {
  try {
    let event = new Event({
      ...eventData,
      creator: userId,
    });

    event = await event.save();

    const calendar = await Calendar.findOne({ _id: calendarId });

    if (!calendar) {
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Calendar not found",
      };
    }
    calendar.events.push(event);
    await calendar.save();
    return event;
  } catch (err) {
    throw err;
  }
};

const updateEvent = async (eventId, calendarMember, eventData) => {
  const event = await Event.findById(eventId);

  try {
    return await execEventAction(event, calendarMember, async () => {
      const updatedEvent = await Event.findOneAndUpdate(
        {
          _id: eventId,
        },
        eventData,
        { new: true }
      );
      return updatedEvent;
    });
  } catch (err) {
    throw {
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      message: "You have no permissions",
    };
  }
};

const getEvent = async (id) => {
  return await Event.findById(id);
};

const deleteEvent = async (calendarId, eventId, calendarMember) => {
  const event = await Event.findById(eventId);

  try {
    await execEventAction(event, calendarMember, async () => {
      const calendar = await Calendar.findById(calendarId);
      const eventToRemove = calendar.events.findIndex(
        (i) => i.toString() === event._id.toString()
      );
      calendar.events.splice(eventToRemove, 1);
      await calendar.save();
      await Event.findByIdAndDelete(eventId);
      return true;
    });
    return true;
  } catch (err) {
    throw {
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      message: "You have no permissions",
    };
  }
};

const getCalendar = async (calendarId, settings) => {
  if (!settings.show) settings.show = [];

  try {
    const calendar = await Calendar.findById(calendarId)
      .populate({
        path: "events",
        match: {
          type: { $in: settings.show },
          startAt: { $gte: settings.startAt, $lte: settings.endAt },
        },
      })
      .populate({
        path: "calendarUsers",
        select: "user role",
        populate: { path: "user", select: "-password" },
      })
      .exec();

    if (!calendar) {
      throw {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Calendar does not exist",
      };
    }

    return calendar;
  } catch (err) {
    throw err;
  }
};

const sendInviteToCalendar = async (requestorId, calendarId, email) => {
  const calendar = await Calendar.findById(calendarId);
  const user = await User.findById(requestorId);
  if (!calendar || !user) {
    throw {
      statusCode: HttpStatus.NOT_FOUND,
      message: "Resource does not exist",
    };
  }

  if (email === user.email) {
    throw {
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      message: "Can't inite yourself",
    };
  }

  const iTSecret = process.env.JWT_CONFIRM_TOKEN_SECRET;
  const iTExp = process.env.JWT_INVITE_TOKEN_EXPIRATION_TIME;
  const token = jwt.sign({ email, calendarId }, iTSecret, {
    expiresIn: iTExp,
  });

  invTokens.set(token, true);

  const context = {
    username: email,
    calendarName: calendar.name,
    invitedBy: user.username,
    link: `${process.env.CLIENT_URL}/login?token=${token}`,
  };

  sendEmail(email, "Invite to calendar", INVITE_TO_CALENDAR_TEMPLATE, context);
  return true;
};

const confirmUserJoin = async (token, currentUserId) => {
  const error = {
    statusCode: HttpStatus.FORBIDDEN,
    message: "Can't join to calendar. Account or token is not valid",
  };

  if (!invTokens.has(token)) throw error;

  try {
    const payload = await jwtVerifyAsync(
      token,
      process.env.JWT_CONFIRM_TOKEN_SECRET
    );

    const user = await User.findById(currentUserId);
    const calendar = await Calendar.findById(payload.calendarId);

    if (!calendar || !user || !user.email === payload.email) throw error;

    let calendarUser = new CalendarUser({
      user,
      role: "guest",
    });

    calendarUser = await calendarUser.save();
    calendar.calendarUsers.push(calendarUser._id);
    await calendar.save();

    invTokens.delete(token);
  } catch (err) {
    throw err;
  }
};

const deleteUserFromCalendar = async (calendarId, memberMe, memberId) => {
  const memberToDel = await CalendarUser.findById(memberId);
  const calendar = await Calendar.findById(calendarId);

  const error = {
    statusCode: HttpStatus.METHOD_NOT_ALLOWED,
    message: "You don't have permission",
  };

  if (!memberToDel || !calendar) {
    throw {
      statusCode: HttpStatus.NOT_FOUND,
      message: "Resource does not exist",
    };
  }

  // check if memberToDel is from the same calendar
  const memberToDelValid = calendar.calendarUsers.find(
    (u) => u.toString() === memberId
  );

  if (!memberToDelValid) {
    throw error;
  }

  const removeMember = async () => {
    const memberToRemove = calendar.calendarUsers.findIndex(
      (i) => i.toString() === memberId.toString()
    );
    calendar.calendarUsers.splice(memberToRemove, 1);
    await calendar.save();
    await CalendarUser.findByIdAndDelete(memberId);
  };

  const samePerson = memberMe._id.toString() === memberToDel._id.toString();

  if (samePerson && memberMe.role !== "owner") {
    return await removeMember();
  } else if (
    !samePerson &&
    memberToDel.role === "guest" &&
    memberMe.role === "owner"
  ) {
    return await removeMember();
  }
  throw error;
};

module.exports = {
  createCalendar,
  getMyCalendars,
  updateCalendar,
  createEvent,
  updateEvent,
  getEvent,
  deleteEvent,
  getCalendar,
  sendInviteToCalendar,
  confirmUserJoin,
  deleteUserFromCalendar,
};
