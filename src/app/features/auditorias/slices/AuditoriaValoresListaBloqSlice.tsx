import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaValoresListaBloq } from "../models/IAuditoriaValoresListaBloq";
import { AuditoriaValoresListaBloqService } from "../services/AuditoriaValoresListaBloq.service";

const service = new AuditoriaValoresListaBloqService();

class AuditoriaValoresListaBloqClassSlice extends GenericSlice<IAuditoriaValoresListaBloq> {
  constructor(private service: AuditoriaValoresListaBloqService) {
    super("AuditoriaValoresListaBloq", service);
  }
}

export const AuditoriaValoresListaBloqSliceRequest = new AuditoriaValoresListaBloqClassSlice(service);

const initialState: IIniState<IAuditoriaValoresListaBloq> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaValoresListaBloqSlice = createSlice({
  name: "AuditoriaValoresListaBloq",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaValoresListaBloqSliceRequest.builderAll(builder);
  }
});
