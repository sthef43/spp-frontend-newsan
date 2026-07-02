import { IDobSemi } from "app/models/IDobSemi";
import { DobSemiService } from "app/services/dobSemi.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobSemiService = new DobSemiService();
class dobSemiClassSlice extends GenericSlice<IDobSemi> {
  constructor(private service: DobSemiService) {
    super("DobSemi", service);
  }
  //nuevos asyncthunks aqui
}
export const DobSemiSliceRequests = new dobSemiClassSlice(dobSemiService);

const initialState: IIniState<IDobSemi> = {
  loading: null,
  data: null
};

export const dobSemiSlice = createSlice({
  name: "DobSemi",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobSemiSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
