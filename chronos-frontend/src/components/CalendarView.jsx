import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";

const CalendarView = ({ events, setStartAt, setEndAt }) => {
  const [hintEvent, setHintEvent] = useState(null);

  const handleDatesSet = (dateInfo) => {
    console.log(
      "Visible range of dates changed:",
      dateInfo.startStr,
      dateInfo.endStr
    );
    setStartAt(dateInfo.startStr);
    setEndAt(dateInfo.endStr);
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
        events={events.map((event) => ({
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
      />
    </Box>
  );
};

export default CalendarView;
