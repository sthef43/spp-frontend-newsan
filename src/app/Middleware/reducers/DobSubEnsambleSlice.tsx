import { IDobSubEnsamble } from "app/models/IDobSubEnsamble";
import { DobSubEnsambleService } from "app/services/dobSubEnsamble.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobSubEnsambleService = new DobSubEnsambleService();
class dobSubEnsambleClassSlice extends GenericSlice<IDobSubEnsamble> {
  constructor(private service: DobSubEnsambleService) {
    super("DobSubEnsamble", service);
  }
  //nuevos asyncthunks aqui
}
export const DobSubEnsambleSliceRequests = new dobSubEnsambleClassSlice(dobSubEnsambleService);

const initialState: IIniState<IDobSubEnsamble> = {
  loading: null,
  data: null
};

export const dobSubEnsambleSlice = createSlice({
  name: "DobSubEnsamble",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobSubEnsambleSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
