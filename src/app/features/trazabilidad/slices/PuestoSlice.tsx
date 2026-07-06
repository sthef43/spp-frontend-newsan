import { PuestoService } from "../services/puesto.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";
import { IPuesto } from "app/models";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const puestoService = new PuestoService();
class puestoClassSlice extends GenericSlice<IPuesto> {
  constructor(private service: PuestoService) {
    super("Puesto", service);
  }
  getListByTipoRequest = createAsyncThunk<IPuesto[], string>(`Puesto/getListByTipoRequest`, async (string, info) => {
    return await errorNotification(() => this.service.GetListByTipo(string), info);
  });
}
export const PuestoSliceRequests = new puestoClassSlice(puestoService);

const initialState: IIniState<IPuesto> = {
  loading: null,
  data: null
};

export const PuestoSlice = createSlice({
  name: "Puesto",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PuestoSliceRequests.builderAll(builder);
  }
});
