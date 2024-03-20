const { Schema, model } = require("mongoose");

const CalendarModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: "events",
    },
  ],
  calendarUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "calendar_users",
    },
  ],
});

module.exports = model("calendars", CalendarModel);
