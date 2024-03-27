import { apiSlice } from "../../app/api/apiSlice";

export const calendarsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCalendars: builder.query({
      query: () => "/calendars",
    }),

    getAllCalendars: builder.mutation({
      query: () => ({
        url: `/calendars`,
        method: "GET",
      }),
    }),
    getCalendarDataWithFilters: builder.mutation({
      query: ({ calendarId, filter }) => ({
        url: `/calendars/${calendarId}/receive-events`,
        method: "POST",
        body: { ...filter },
      }),
    }),

    getCalendar: builder.mutation({
      query: ({ calendarId }) => ({
        url: `/calendars/${calendarId}`,
        method: "GET",
      }),
    }),

    updateCalendar: builder.mutation({
      query: ({ calendarId, calendarData }) => ({
        url: `/calendars/${calendarId}`,
        method: "PATCH",
        body: { ...calendarData },
      }),
    }),

    createCalendar: builder.mutation({
      query: ({ calendarData }) => ({
        url: `/calendars`,
        method: "POST",
        body: { ...calendarData },
      }),
    }),

    deleteCalendar: builder.mutation({
      query: ({ calendarId }) => ({
        url: `/calendars/${calendarId}`,
        method: "DELETE",
      }),
    }),

    getAllHolidays: builder.mutation({
      query: () => ({
        url: `/calendars/holidays`,
        method: "GET",
      }),
    }),

    getEvent: builder.mutation({
      query: ({ calendarId, eventId }) => ({
        url: `/calendars/${calendarId}/event/${eventId}`,
        method: "GET",
      }),
    }),

    createEvent: builder.mutation({
      query: ({ calendarId, eventData }) => ({
        url: `/calendars/${calendarId}/event`,
        method: "POST",
        body: { ...eventData },
      }),
    }),

    updateEvent: builder.mutation({
      query: ({ calendarId, eventId, eventData }) => ({
        url: `/calendars/${calendarId}/event/${eventId}`,
        method: "PATCH",
        body: { ...eventData },
      }),
    }),

    deleteEvent: builder.mutation({
      query: ({ calendarId, eventId }) => ({
        url: `/calendars/${calendarId}/event/${eventId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCalendarsQuery,
  useGetAllHolidaysMutation,
  useGetCalendarDataWithFiltersMutation,
  useGetEventMutation,
  useUpdateEventMutation,
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetCalendarMutation,
  useUpdateCalendarMutation,
  useCreateCalendarMutation,
  useGetAllCalendarsMutation,
  useDeleteCalendarMutation,
} = calendarsApiSlice;
