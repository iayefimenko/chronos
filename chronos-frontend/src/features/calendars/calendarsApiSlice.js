import { apiSlice } from "../../app/api/apiSlice";

export const calendarsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCalendars: builder.query({
      query: () => "/calendars",
    }),
    getCalendarDataWithFilters: builder.mutation({
      query: ({ calendarId, filter }) => ({
        url: `/calendars/${calendarId}/receive-events`,
        method: "POST",
        body: { ...filter },
      }),
    }),
  }),
});

export const { useGetCalendarsQuery, useGetCalendarDataWithFiltersMutation } =
  calendarsApiSlice;
