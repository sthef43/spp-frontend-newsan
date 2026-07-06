import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IDobladora } from "../../models/IDobladora";
import { DobladoraService } from "../../services/dobladora.service";

const dobladoraService = new DobladoraService();

class DobladoraClassSlice extends GenericSlice<IDobladora> {
  constructor(private service: DobladoraService) {
    super("Dobladora", service);
  }
}

export const DobladoraSliceRequest = new DobladoraClassSlice(dobladoraService);

const inititalState: IIniState<IDobladora> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const DobladoraSlice = createSlice({
  name: "Dobladora",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    DobladoraSliceRequest.builderAll(builder);
  }
});
