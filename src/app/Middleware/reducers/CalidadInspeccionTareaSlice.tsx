import { IIniState } from "app/models/IIniState";
import {  createSlice } from "@reduxjs/toolkit";

import { ICalidadInspeccionTarea } from "app/models/ICalidadInspeccionTarea";
import { CalidadInspeccionTareaService } from "app/services/calidadInspeccionTarea.service";
import { GenericSlice } from "./genericSlice";


const calidadInspeccionTareaService = new CalidadInspeccionTareaService();

class CalidadInspeccionTareaClassSlice  extends GenericSlice<ICalidadInspeccionTarea> { 
  constructor(private service: CalidadInspeccionTareaService) {
    super("CalidadInspeccionTarea",service)
  }
  //Nuevos endpoints que no heredan de generic
}
export const CalidadInspeccionTareaSliceRequest = new CalidadInspeccionTareaClassSlice(calidadInspeccionTareaService);

const initialState: IIniState<ICalidadInspeccionTarea> = {
  loading: null,
  dataAll: [],
  data: null
};

export const CalidadInspeccionTareaSlice = createSlice({
  name: "calidadInspeccionTarea",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
