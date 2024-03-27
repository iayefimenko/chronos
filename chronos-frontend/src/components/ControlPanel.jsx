import React, { useEffect, useState } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  MenuItem,
  Select,
  Stack,
  Divider,
  IconButton,
  Typography,
  Checkbox,
  Grid,
  Button,
} from "@mui/material";

import AddCardSharpIcon from "@mui/icons-material/AddCardSharp";
import ModeEditOutlineSharpIcon from "@mui/icons-material/ModeEditOutlineSharp";

import { EventEdit, UserBlock } from ".";

const ControlPanel = ({
  calendars,
  currentCalendar,
  setCurrentCalendar,
  eventFilter,
  setEventFilter,
  showHolidays,
  setShowHolidays,
  setIsEditModalOpen,
  setEditCalendar,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCalendarChange = (event) => {
    setCurrentCalendar(event.target.value);
  };

  const handleAddEventBtnClick = () => {
    if (currentCalendar) {
      setSelectedEvent({
        eventId: null,
        calendarId: currentCalendar,
      });
      setIsModalOpen(true);
    }
  };

  const handleCheckboxClicked = (event) => {
    const checked = event.target.checked;
    const value = event.target.value;
    console.log(value, checked);
    if (value !== "holidays") {
      if (checked) {
        setEventFilter({ ...eventFilter, show: [...eventFilter.show, value] });
      } else {
        const newShow = eventFilter.show.filter((option) => option !== value);
        setEventFilter({ ...eventFilter, show: newShow });
      }
    } else {
      setShowHolidays(checked);
    }
  };

  return (
    <Box
      bgcolor="#f0f0f0"
      height="100vh"
      width={isSmallScreen ? "100%" : "400px"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={5}
    >
      <Stack
        direction="row"
        width="100%"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Select
          value={currentCalendar}
          onChange={handleCalendarChange}
          style={{ width: "80%", marginBottom: "20px" }}
        >
          {calendars?.map((calendar) => (
            <MenuItem key={calendar.id} value={calendar._id}>
              {calendar.name}
            </MenuItem>
          ))}
        </Select>

        <Stack direction="column" justifyContent="center">
          <IconButton
            onClick={() => {
              //Create
              setEditCalendar(false);
              setIsEditModalOpen(true);
            }}
          >
            <AddCardSharpIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              if (!currentCalendar) return;
              //EDIT
              setEditCalendar(true);
              setIsEditModalOpen(true);
            }}
          >
            <ModeEditOutlineSharpIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Divider
        orientation="horizontal"
        sx={{ mt: 3, backgroundColor: "gray" }}
        flexItem
      />
      <Typography mt={2} fontSize={17} fontWeight="bold">
        Show
      </Typography>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <Checkbox
              color="primary"
              value="holidays"
              onChange={handleCheckboxClicked}
              checked={showHolidays}
            />
            <Typography fontSize={15}>Holidays</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <Checkbox
              color="primary"
              value="arrangement"
              onChange={handleCheckboxClicked}
            />
            <Typography fontSize={15}>Arrangements</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <Checkbox
              color="primary"
              value="task"
              onChange={handleCheckboxClicked}
            />
            <Typography fontSize={15}>Tasks</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <Checkbox
              color="primary"
              value="reminder"
              onChange={handleCheckboxClicked}
            />
            <Typography fontSize={15}>Reminders</Typography>
          </Stack>
        </Grid>
      </Grid>
      <Divider
        orientation="horizontal"
        sx={{ mt: 3, mb: 3, backgroundColor: "gray" }}
        flexItem
      />
      <Button
        variant="contained"
        onClick={handleAddEventBtnClick}
        disabled={!currentCalendar}
      >
        Create Event
      </Button>

      <Divider
        orientation="horizontal"
        sx={{ mt: 3, mb: 3, backgroundColor: "gray" }}
        flexItem
      />
      <Box>
        <UserBlock />
      </Box>

      <EventEdit
        currentEvent={selectedEvent}
        setCurrentEvent={setSelectedEvent}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </Box>
  );
};

export default ControlPanel;
