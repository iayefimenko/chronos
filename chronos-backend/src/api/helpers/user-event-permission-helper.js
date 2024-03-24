const execEventAction = async (event, calendarMember, func) => {
  if (
    event.creator._id.toString() === calendarMember.user._id.toString() ||
    calendarMember.role === "owner"
  ) {
    return await func();
  }
  throw "";
};

module.exports = { execEventAction };
