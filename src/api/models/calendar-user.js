const { Schema, model, default: mongoose } = require("mongoose");
const { CALENDAR_USER_ROLE } = require("../../config/constants");

const CalendarUserModel = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  role: {
    type: String,
    enum: CALENDAR_USER_ROLE,
    default: "guest",
  },
});

module.exports = model("calendar_users", CalendarUserModel);
