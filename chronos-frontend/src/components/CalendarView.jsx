import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Modal, Button } from "@mui/material";

import {
  useGetHolidaysQuery,
  useGetAllHolidaysMutation,
} from "../features/calendars/calendarsApiSlice";
import EventEdit from "./EventEdit";

const CalendarView = ({
  events,
  setStartAt,
  setEndAt,
  showHolidays,
  currentCalendar,
}) => {
  const [loadHolidays] = useGetAllHolidaysMutation();
  const [holidays, setHolidays] = useState([]);
  const [eventData, setEventData] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDatesSet = (dateInfo) => {
    setStartAt(dateInfo.startStr);
    setEndAt(dateInfo.endStr);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const holidaysData = await loadHolidays().unwrap();
        const mapped = holidaysData.holidays.map((h) => ({
          title: h.name,
          startAt: h.date,
          endAt: h.date,
          color: "#00ff11",
        }));
        setHolidays(mapped);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showHolidays) {
      setEventData([...events, ...holidays]);
    } else {
      setEventData([...events]);
    }
  }, [showHolidays, events]);

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event._def.publicId !== "undefined") {
      setSelectedEvent({
        eventId: clickInfo.event._def.publicId,
        calendarId: currentCalendar,
      });
      setIsModalOpen(true);
    }
  };

  const handleDateClick = (arg) => {
    if (arg.allDay && !arg.jsEvent.target.classList.contains("fc-event")) {
      if (!currentCalendar) return;
      setSelectedEvent({
        eventId: null,
        calendarId: currentCalendar,
      });
      setIsModalOpen(true);
    }
  };

  return (
    <Box sx={{ flex: 1 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        contentHeight="80vh"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        datesSet={handleDatesSet}
        events={eventData.map((event) => ({
          id: event._id,
          description: event.description,
          title: event.title,
          start: event.startAt,
          end: event.endAt,
          color: event.color,
        }))}
        eventContent={(eventInfo) => {
          return (
            <div
              style={{
                padding: "7px",
                backgroundColor: eventInfo.backgroundColor,
                color: "black",
                borderRadius: "5px",
                fontSize: "16px",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {eventInfo.timeText} {eventInfo.event.title}
            </div>
          );
        }}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
      <EventEdit
        currentEvent={selectedEvent}
        setCurrentEvent={setSelectedEvent}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </Box>
  );
};

export default CalendarView;
