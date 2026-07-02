import { IDobTipoFrigoria } from "app/models/IDobTipoFrigoria";
import { DobTipoFrigoriaService } from "app/services/dobTipoFrigoria.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobTipoFrigoriaService = new DobTipoFrigoriaService();
class dobTipoFrigoriaClassSlice extends GenericSlice<IDobTipoFrigoria> {
  constructor(private service: DobTipoFrigoriaService) {
    super("DobTipoFrigoria", service);
  }
  //nuevos asyncthunks aqui
}
export const DobTipoFrigoriaSliceRequests = new dobTipoFrigoriaClassSlice(dobTipoFrigoriaService);

const initialState: IIniState<IDobTipoFrigoria> = {
  loading: null,
  data: null
};

export const dobTipoFrigoriaSlice = createSlice({
  name: "DobTipoFrigoria",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobTipoFrigoriaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
