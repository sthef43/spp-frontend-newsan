import { IHojaPComentario } from "app/models/IHojaPComentario";
import { HojaPComentarioService } from "app/services/hojaPComentario.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const hojaPComentarioService = new HojaPComentarioService();
class hojaPComentarioClassSlice extends GenericSlice<IHojaPComentario> {
  constructor(private service: HojaPComentarioService) {
    super("HojaPComentario", service);
  }
  //nuevos asyncthunks aqui
  getListByHojaParametroIdRequest = createAsyncThunk<IHojaPComentario[], number>(
    `HojaPComentario/getListByHojaParametroIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByHojaParametroId(number), info);
    }
  );
}
export const HojaPComentarioSliceRequests = new hojaPComentarioClassSlice(hojaPComentarioService);

const initialState: IIniState<IHojaPComentario> = {
  loading: null,
  data: null
};

export const hojaPComentarioSlice = createSlice({
  name: "HojaPComentario",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    HojaPComentarioSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
