import { IArea } from "app/models/IArea";
import { AreaService } from "app/services/area.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const areaService = new AreaService();
class areaClassSlice extends GenericSlice<IArea> {
  constructor(private service: AreaService) {
    super("Area", service);
  }
  //nuevos asyncthunks aqui
}
export const AreaSliceRequests = new areaClassSlice(areaService);

const initialState: IIniState<IArea> = {
  loading: null,
  data: null
};

export const areaSlice = createSlice({
  name: "Area",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AreaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
