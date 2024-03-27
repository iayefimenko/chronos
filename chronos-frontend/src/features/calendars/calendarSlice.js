import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shouldUpdateEvents: false,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setShouldUpdateEvents: (state, action) => {
      state.shouldUpdateEvents = action.payload;
    },
  },
});

export const { setShouldUpdateEvents, setCurrentCalendar } =
  calendarSlice.actions;
export default calendarSlice.reducer;

export const selectShouldUpdateEvents = (state) =>
  state.calendar.shouldUpdateEvents;
