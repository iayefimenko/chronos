import React, { useEffect } from "react";
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

const ControlPanel = ({
  calendars,
  currentCalendar,
  setCurrentCalendar,
  eventFilter,
  setEventFilter,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleCalendarChange = (event) => {
    console.log("Set Current value", event.target.v);
    setCurrentCalendar(event.target.value);
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
          displayEmpty
          style={{ width: "80%", marginBottom: "20px" }}
        >
          <MenuItem value="" disabled>
            Select Current Calendar
          </MenuItem>
          {calendars?.map((calendar) => (
            <MenuItem key={calendar.id} value={calendar._id}>
              {calendar.name}
            </MenuItem>
          ))}
        </Select>
        <Stack direction="column" justifyContent="center">
          <IconButton>
            <AddCardSharpIcon />
          </IconButton>
          <IconButton>
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
      <Button variant="contained">Create Event</Button>
    </Box>
  );
};

export default ControlPanel;
