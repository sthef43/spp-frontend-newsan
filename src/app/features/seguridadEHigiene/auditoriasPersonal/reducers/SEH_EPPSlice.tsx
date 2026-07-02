import { createSlice } from "@reduxjs/toolkit";
import { SEH_EPP } from "../interfaces/SEH_EPP";
import { SEH_EPPServices } from "../services/SEH_EPP.services";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";

const sehEPPService = new SEH_EPPServices();

class SEHEPPClassSlice extends GenericSlice<SEH_EPP> {
  constructor(private service: SEH_EPPServices) {
    super("SEHEPP", service);
  }
}

export const SEHEPPSliceRequest = new SEHEPPClassSlice(sehEPPService);

const initialState: IIniState<SEH_EPP> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const sehEPPSlice = createSlice({
  name: "SEHEPP ",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SEHEPPSliceRequest.builderAll(builder);
  }
});
