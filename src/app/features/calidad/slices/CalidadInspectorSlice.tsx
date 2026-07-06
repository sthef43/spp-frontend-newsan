import { IIniState } from "app/models/IIniState";
import {  createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { CalidadInspectorService } from "app/services/calidad-inspector.service";
import { ICalidadInspector } from "app/models/ICalidadInspector";


const calidadInspectorService = new CalidadInspectorService();

class CalidadInspectorClassSlice  extends GenericSlice<ICalidadInspector> { 
  constructor(private service: CalidadInspectorService) {
    super("CalidadInspector",service)
  }
  //Nuevos endpoints que no heredan de generic
}
export const CalidadInspectorSliceRequest = new CalidadInspectorClassSlice(calidadInspectorService);

const initialState: IIniState<ICalidadInspector> = {
  loading: null,
  dataAll: [],
  data: null
};

export const CalidadInspectorSlice = createSlice({
  name: "calidadInspector",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
