/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IObjectFormPlan } from "../models/IObjectFormPlan";

export interface optionAditional<T> extends IIniState<IObjectFormPlan> {
  estadoEdicion: boolean;
  estadoEdicionEmbarque: boolean;
}

const initialState: optionAditional<IObjectFormPlan> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null,
  estadoEdicion: false,
  estadoEdicionEmbarque: false
};

export const OptionFormSlice = createSlice({
  name: "OptionFormSlice",
  initialState: initialState,
  reducers: {
    setNewPlanAll: (state, action: PayloadAction<IObjectFormPlan[]>) => {
      state.dataAll = action.payload;
    },
    setModeEdition: (state, action: PayloadAction<boolean>) => {
      state.estadoEdicion = action.payload;
    },
    setModeEditionEmbarque: (state, action: PayloadAction<boolean>) => {
      state.estadoEdicionEmbarque = action.payload;
    }
  }
});
