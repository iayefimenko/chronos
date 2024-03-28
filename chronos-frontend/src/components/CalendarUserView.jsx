import React, { useState } from "react";
import { Stack, Typography, IconButton } from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmationDialog from "./ConfirmationDialog";
import InfoHint from "./InfoHint";

import { useDeleteUserFromCalendarMutation } from "../features/calendars/calendarsApiSlice";

const CalendarUserView = ({ displayFor, data, calendar, setCalendar }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInfoHint, setShowInfoHint] = useState(false);

  const [deleteUser] = useDeleteUserFromCalendarMutation();

  const handleCalendarMemberDelete = async () => {
    try {
      await deleteUser({
        calendarId: calendar._id,
        data: { memberId: data._id },
      }).unwrap();
      const newCalendarUsers = calendar.calendarUsers.filter(
        (u) => u._id !== data._id
      );
      setCalendar({ ...calendar, calendarUsers: newCalendarUsers });
      setShowInfoHint(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography fontSize={15} fontWeight="bold">
          {data.user.email}
        </Typography>
        <Typography fontSize={15} fontWeight="bold">
          {data.role}
        </Typography>
      </Stack>
      {displayFor === "owner" && data.role !== "owner" && (
        <IconButton
          sx={{ verticalAlign: "middle" }}
          onClick={() => setShowConfirm(true)}
        >
          <DeleteOutlineIcon sx={{ color: "red", fontSize: "1.5rem" }} />
        </IconButton>
      )}

      {showConfirm && (
        <ConfirmationDialog
          text="Do you really want to delete this user from calendar?"
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            handleCalendarMemberDelete();
          }}
        />
      )}
      {showInfoHint && (
        <InfoHint
          text="You have successfully removed the user from the calendar"
          onClose={() => setShowInfoHint(false)}
        />
      )}
    </Stack>
  );
};

export default CalendarUserView;
