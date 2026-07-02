import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { AreaTrazaService } from "app/services/areaTraza.service";
import { IAreaTraza } from "app/models/IAreaTraza";

const areaTrazaService = new AreaTrazaService();
class areaTrazaClassSlice extends GenericSlice<IAreaTraza> {
  constructor(private service: AreaTrazaService) {
    super("AreaTraza", service);
  }
  //nuevos asyncthunks aqui
}
export const AreaTrazaSliceRequests = new areaTrazaClassSlice(areaTrazaService);

const initialState: IIniState<IAreaTraza> = {
  loading: null,
  data: null
};

export const areaTrazaSlice = createSlice({
  name: "AreaTraza",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AreaTrazaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
