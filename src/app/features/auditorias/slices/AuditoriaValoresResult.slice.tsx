import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaValoresResult } from "../models/IAuditoriaValoresResult";
import { AuditoriaValoresResultService } from "../services/AuditoriaValoresResult.services";

const auditoriaValoresResultService = new AuditoriaValoresResultService();

class ClassSlice extends GenericSlice<IAuditoriaValoresResult> {
  constructor(private service: AuditoriaValoresResultService) {
    super("AuditoriaValoresResult", service);
  }
}

export const AuditoriaValoresResultSliceRequest = new ClassSlice(auditoriaValoresResultService);

const inititalState: IIniState<IAuditoriaValoresResult> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditoriaValoresResultSlice = createSlice({
  name: "AuditoriaValoresResult",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaValoresResultSliceRequest.builderAll(builder);
  }
});
