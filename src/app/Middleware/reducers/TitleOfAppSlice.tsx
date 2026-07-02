import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface dataNeaded {
  Title: string;
}

export interface iniState {
  Title: string;
}
const initialState: iniState = {
  Title: ""
};
export const TitleOfAppSlice = createSlice({
  name: "TitleOfApp",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState,
  reducers: {
    SetTitleOfApp: (state, action: PayloadAction<dataNeaded>) => {
      state.Title = action.payload.Title;
    }
  }
});
