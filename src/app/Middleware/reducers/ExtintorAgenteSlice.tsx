import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models";
import { IExtintorAgente } from "app/models/IExtintorAgente";
import { ExtintorAgenteService } from "app/services/extintorAgente.service";

const extintorAgenteService = new ExtintorAgenteService();
class extintorAgenteClassSlice extends GenericSlice<IExtintorAgente> {
  constructor(private service: ExtintorAgenteService) {
    super("ExtintorAgente", service);
  }
  //nuevos asyncthunks aqui
  getListRequest = createAsyncThunk<IExtintorAgente[]>(`Extintor/getListRequest`, async (x, info) => {
    return await errorNotification(() => this.service.GetList(), info);
  });
}
export const ExtintorAgenteSliceRequests = new extintorAgenteClassSlice(extintorAgenteService);

const initialState: IIniState<IExtintorAgente> = {
  loading: null,
  data: null
};

export const extintorAgenteSlice = createSlice({
  name: "ExtintorAgente",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ExtintorAgenteSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
