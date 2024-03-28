import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as dayjs from "dayjs";

import { setShouldUpdateEvents } from "../features/calendars/calendarSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  useGetEventMutation,
  useUpdateEventMutation,
  useCreateEventMutation,
  useDeleteEventMutation,
} from "../features/calendars/calendarsApiSlice";

import { selectCurrentUser } from "../features/auth/authSlice";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import ConfirmationDialog from "./ConfirmationDialog";

const EventEdit = ({ currentEvent, setCurrentEvent, isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setCurrentEvent(null);
    setIsOpen(false);
  };

  const me = useSelector(selectCurrentUser);

  const isEdit = currentEvent?.eventId ? true : false;
  const today = new Date();
  const initialEventData = {
    title: "",
    description: "",
    type: "arrangement",
    color: "#ff0000",
    startAt: currentEvent?.date || today.toISOString(),
    endAt: currentEvent?.date || today.toISOString(),
  };
  const [eventData, setEventData] = useState();

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasPermissionToEdit, setHasPermisionToEdit] = useState();

  const [loadEventInfo] = useGetEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [createEvent] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  useEffect(() => {
    setEventData(initialEventData);
    if (isOpen && isEdit) {
      const fetchData = async () => {
        try {
          const eventData = await loadEventInfo({
            calendarId: currentEvent.calendarId,
            eventId: currentEvent.eventId,
          }).unwrap();

          setHasPermisionToEdit(
            eventData.event.creator._id === me._id ||
              currentEvent.userRole === "owner"
          );
          setEventData(eventData.event);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    } else {
      setHasPermisionToEdit(true);
    }
  }, [isOpen, isEdit]);

  const handleEventSubmit = async () => {
    let { type, title, description, startAt, endAt, color } = eventData;

    if (type !== "reminder" && description.length < 16) {
      setDescriptionError(true);
    } else if (title.length < 4) {
      setTitleError(true);
    } else {
      if (type === "reminder") description = "Default description";
      if (type !== "arrangement") {
        const startDate = new Date(startAt);
        startDate.setHours(startDate.getHours() + 1);
        endAt = startDate.toISOString();
      }
      try {
        if (isEdit) {
          await updateEvent({
            calendarId: currentEvent.calendarId,
            eventId: currentEvent.eventId,
            eventData: { type, title, description, startAt, endAt, color },
          }).unwrap();
        } else {
          await createEvent({
            calendarId: currentEvent.calendarId,
            eventData: { type, title, description, startAt, endAt, color },
          }).unwrap();
        }
      } catch (err) {
        console.log(err);
      }
      dispatch(setShouldUpdateEvents(true));
      handleCloseModal();
    }
  };

  const handleEventDelete = async () => {
    try {
      await deleteEvent({
        calendarId: currentEvent.calendarId,
        eventId: currentEvent.eventId,
      }).unwrap();
    } catch (err) {
      console.log(err);
    }
    dispatch(setShouldUpdateEvents(true));
    handleCloseModal();
  };

  return (
    <Modal open={isOpen} onClose={handleCloseModal} hideBackdrop={true}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: "500px",
          overflow: "auto",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" gutterBottom>
            {isEdit ? "Edit event" : "Create Event"}
          </Typography>

          {isEdit && (
            <Typography>{`Created by: ${
              me._id === eventData?.creator?._id
                ? "ME"
                : eventData?.creator?.email
            }`}</Typography>
          )}
          {isEdit && hasPermissionToEdit && (
            <IconButton
              sx={{ verticalAlign: "middle" }}
              onClick={() => setShowConfirm(true)}
            >
              <DeleteOutlineIcon sx={{ color: "red", fontSize: "1.5rem" }} />
            </IconButton>
          )}
        </Stack>

        {eventData && (
          <Stack spacing={2}>
            <FormControl fullWidth disabled={!hasPermissionToEdit}>
              <InputLabel htmlFor="event-type">Event Type</InputLabel>
              <Select
                value={eventData.type}
                fullWidth
                id="event-type"
                onChange={(e) =>
                  setEventData({ ...eventData, type: e.target.value })
                }
              >
                <MenuItem value="arrangement">Arrangement</MenuItem>
                <MenuItem value="reminder">Reminder</MenuItem>
                <MenuItem value="task">Task</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Title"
              disabled={!hasPermissionToEdit}
              fullWidth
              value={eventData.title}
              inputProps={{ maxLength: 100 }}
              error={titleError}
              helperText={
                titleError ? "Title can't have less than 4 chars" : ""
              }
              onChange={(e) => {
                setEventData({ ...eventData, title: e.target.value });
                setTitleError(e.target.value.length < 4);
              }}
            />
            {eventData.type !== "reminder" && (
              <TextField
                label="Description"
                disabled={!hasPermissionToEdit}
                fullWidth
                multiline
                rows={4}
                value={eventData.description}
                error={descriptionError}
                helperText={
                  descriptionError
                    ? "Description can't have less than 16 chars"
                    : ""
                }
                inputProps={{ maxLength: 200 }}
                onChange={(e) => {
                  setEventData({ ...eventData, description: e.target.value });
                  setDescriptionError(e.target.value.length < 16);
                }}
              />
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                disabled={!hasPermissionToEdit}
                label="Start At"
                value={dayjs(eventData.startAt)}
                onChange={(newValue) =>
                  setEventData({
                    ...eventData,
                    startAt: newValue.toISOString(),
                  })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              {eventData.type === "arrangement" && (
                <DateTimePicker
                  disabled={!hasPermissionToEdit}
                  label="End At"
                  value={dayjs(eventData.endAt)}
                  onChange={(newValue) =>
                    setEventData({
                      ...eventData,
                      endAt: newValue.toISOString(),
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              )}
            </LocalizationProvider>
            <Typography variant="body1" gutterBottom>
              Event Color
            </Typography>

            <input
              type="color"
              disabled={!hasPermissionToEdit}
              value={eventData.color}
              onChange={(e) =>
                setEventData({ ...eventData, color: e.target.value })
              }
              style={{ width: "100%" }}
            />
            <Stack direction="row" justifyContent="center" spacing={5}>
              <Button
                disabled={!hasPermissionToEdit}
                variant="contained"
                color="info"
                onClick={handleEventSubmit}
                sx={{ width: "50%" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleCloseModal}
                sx={{ width: "50%" }}
              >
                Close
              </Button>
            </Stack>
          </Stack>
        )}
        {showConfirm && (
          <ConfirmationDialog
            text="Do you really want to delete this event?"
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              handleEventDelete();
            }}
          />
        )}
      </Box>
    </Modal>
  );
};

export default EventEdit;
