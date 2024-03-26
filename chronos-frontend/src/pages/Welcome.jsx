import React, { useState, useEffect } from "react";
import { ControlPanel, CalendarView } from "../components";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import { useGetCalendarDataWithFiltersMutation } from "../features/calendars/calendarsApiSlice";
import { useGetCalendarsQuery } from "../features/calendars/calendarsApiSlice";

const Welcome = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [currentCalendar, setCurrentCalendar] = useState("");
  const [eventFilter, setEventFilter] = useState({
    startAt: null,
    endAt: null,
    show: [],
  });

  //events from ... to
  const [startAt, setStartAt] = useState();
  const [endAt, setEndAt] = useState();

  const [events, setEvents] = useState([]);

  const { data } = useGetCalendarsQuery();

  const [loadCalendarData] = useGetCalendarDataWithFiltersMutation();

  useEffect(() => {
    if (currentCalendar) {
      const fetchData = async () => {
        try {
          console.log("ID", currentCalendar);
          const calendar = await loadCalendarData({
            calendarId: currentCalendar.toString(),
            filter: {
              ...eventFilter,
            },
          }).unwrap();
          console.log("Loaded events:", calendar.calendarData.events);
          setEvents(calendar.calendarData.events);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [currentCalendar, eventFilter]);

  useEffect(() => {
    setEventFilter({ ...eventFilter, startAt, endAt });
  }, [startAt, endAt]);

  return (
    <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"}>
      <ControlPanel
        calendars={data?.calendars}
        currentCalendar={currentCalendar}
        setCurrentCalendar={setCurrentCalendar}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
      />
      <Box flexGrow={1}>
        <CalendarView
          events={events}
          setStartAt={setStartAt}
          setEndAt={setEndAt}
        />
      </Box>
    </Box>
  );
};

export default Welcome;
