import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

const initialState: any = {
  events: [
    {
      title: "Cumpleaños del jefe",
      start: moment().toDate(),
      end: moment().add(2, "hours").toDate(),
      bgcolor: "#fafafa",
      user: {
        _id: "123",
        name: "Eze"
      },
      notes: "comprar pastel"
    }
  ],
  activeEvent: undefined
};
export const calendarSlice = createSlice({
  name: "calendar",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<any>) => {
      state.activeEvent = action.payload;
    },
    addNew: (state, action: PayloadAction<any>) => {
      state.events = [...state.events, action.payload];
    }
  }
});
