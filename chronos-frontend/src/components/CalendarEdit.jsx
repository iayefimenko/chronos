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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  useUpdateCalendarMutation,
  useCreateCalendarMutation,
  useDeleteCalendarMutation,
} from "../features/calendars/calendarsApiSlice";

import ConfirmationDialog from "./ConfirmationDialog";

const CalendarEdit = ({
  calendar,
  isOpen,
  setIsOpen,
  edit,
  calendarsList,
  setCalendarsList,
  setCurrentCalendar,
}) => {
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const initialState = {
    name: "",
    description: "",
  };

  const [calendarData, setCalendarData] = useState(initialState);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (edit) {
      setCalendarData({
        name: calendar.name,
        description: calendar.description ? calendar.description : "",
      });
    } else {
      setCalendarData(initialState);
    }
  }, [isOpen]);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [createCalendar] = useCreateCalendarMutation();
  const [updateCalendar] = useUpdateCalendarMutation();
  const [deleteCalendar] = useDeleteCalendarMutation();

  const handleSubmit = async () => {
    const { name, description } = calendarData;
    if (name < 4) {
      setNameError(true);
    } else if (description.length > 0 && description.length < 16) {
      setDescriptionError(true);
    } else {
      try {
        if (edit) {
          await updateCalendar({
            calendarId: calendar._id,
            calendarData: {
              name,
              ...(description.length > 0 && { description }),
            },
          }).unwrap();
        } else {
          await createCalendar({
            calendarData: {
              name,
              ...(description.length > 0 && { description }),
            },
          }).unwrap();
        }
      } catch (err) {
        console.log(err);
      }

      const calendarToUpdate = calendarsList.calendars.findIndex(
        (c) => c._id === calendar._id
      );
      if (calendarToUpdate !== -1) {
        const updatedCalendars = [...calendarsList.calendars];
        updatedCalendars[calendarToUpdate] = {
          ...updatedCalendars[calendarToUpdate],
          name,
          description,
        };
        setCalendarsList({ ...calendarsList, calendars: updatedCalendars });
      }
      handleCloseModal();
    }
  };

  const handleDeleteCalendar = async () => {
    try {
      await deleteCalendar({ calendarId: calendar._id }).unwrap();
      const updatedList = calendarsList.calendars.filter(
        (c) => c._id !== calendar._id
      );
      setCalendarsList({ ...calendarsList, calendars: updatedList });
      setCurrentCalendar(updatedList[0]);
      handleCloseModal();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Modal open={isOpen} hideBackdrop={true}>
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
            {edit ? "Edit Calendar" : "Create Calendar"}
          </Typography>
          {edit && !calendar.isDefault && (
            <IconButton
              sx={{ verticalAlign: "middle" }}
              onClick={() => setShowConfirm(true)}
            >
              <DeleteOutlineIcon sx={{ color: "red", fontSize: "1.5rem" }} />
            </IconButton>
          )}
        </Stack>

        <Stack direction="column" spacing={3} mb={3}>
          <TextField
            label="Name"
            fullWidth
            value={calendarData.name}
            inputProps={{ maxLength: 100 }}
            error={nameError}
            helperText={nameError ? "Name can't have less than 4 chars" : ""}
            onChange={(e) => {
              setCalendarData({ ...calendarData, name: e.target.value });
              setNameError(e.target.value.length < 4);
            }}
          />
          <TextField
            label="Description"
            fullWidth
            value={calendarData.description}
            inputProps={{ maxLength: 200 }}
            error={descriptionError}
            helperText={
              descriptionError
                ? "Description can't have less than 16 chars"
                : ""
            }
            onChange={(e) => {
              setCalendarData({ ...calendarData, description: e.target.value });
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="center" spacing={5}>
          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit}
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
        {showConfirm && (
          <ConfirmationDialog
            text="Do you really want to delete this calendar?"
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              handleDeleteCalendar();
            }}
          />
        )}
      </Box>
    </Modal>
  );
};

export default CalendarEdit;
