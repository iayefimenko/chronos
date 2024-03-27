import React, { useState, useEffect } from "react";
import { ControlPanel, CalendarView } from "../components";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import { useGetCalendarDataWithFiltersMutation } from "../features/calendars/calendarsApiSlice";
import { useGetCalendarsQuery } from "../features/calendars/calendarsApiSlice";

import {
  setShouldUpdateEvents,
  selectShouldUpdateEvents,
} from "../features/calendars/calendarSlice";
import { useDispatch, useSelector } from "react-redux";

import { CalendarEdit } from "../components";

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

  const [currentCalendarData, setCurrentCalendarData] = useState({
    events: [],
  });
  const [showHolidays, setShowHolidays] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCalendar, setEditCalendar] = useState(false);

  const { data } = useGetCalendarsQuery();

  const [loadCalendarData] = useGetCalendarDataWithFiltersMutation();

  const dispatch = useDispatch();
  const shoudUpdateEvents = useSelector(selectShouldUpdateEvents);

  const fetchData = async () => {
    try {
      const calendar = await loadCalendarData({
        calendarId: currentCalendar.toString(),
        filter: {
          ...eventFilter,
        },
      }).unwrap();
      setCurrentCalendarData(calendar.calendarData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (currentCalendar) {
      fetchData();
    }
  }, [currentCalendar, eventFilter]);

  useEffect(() => {
    if (shoudUpdateEvents) {
      fetchData();
      dispatch(setShouldUpdateEvents(false));
    }
  }, [shoudUpdateEvents]);

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
        showHolidays={showHolidays}
        setShowHolidays={setShowHolidays}
        setIsEditModalOpen={setIsModalOpen}
        setEditCalendar={setEditCalendar}
      />
      <Box flexGrow={1}>
        <CalendarView
          events={currentCalendarData?.events}
          setStartAt={setStartAt}
          setEndAt={setEndAt}
          showHolidays={showHolidays}
          currentCalendar={currentCalendar}
        />
      </Box>
      <CalendarEdit
        calendar={currentCalendarData}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        edit={editCalendar}
        setCurrentCalendarData={setCurrentCalendarData}
      />
    </Box>
  );
};

export default Welcome;
