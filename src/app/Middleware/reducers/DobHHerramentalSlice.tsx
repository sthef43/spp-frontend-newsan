import { IDobHHerramental } from "app/models/IDobHHerramental";
import { DobHHerramentalService } from "app/services/dobHHerramental.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHHerramentalService = new DobHHerramentalService();
class dobHHerramentalClassSlice extends GenericSlice<IDobHHerramental> {
  constructor(private service: DobHHerramentalService) {
    super("DobHHerramental", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHHerramentalSliceRequests = new dobHHerramentalClassSlice(dobHHerramentalService);

const initialState: IIniState<IDobHHerramental> = {
  loading: null,
  data: null
};

export const dobHHerramentalSlice = createSlice({
  name: "DobHHerramental",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHHerramentalSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
