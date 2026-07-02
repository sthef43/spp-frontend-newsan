import { IDobComentario } from "app/models/IDobComentario";
import { DobComentarioService } from "app/services/dobComentario.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobComentarioService = new DobComentarioService();
class dobComentarioClassSlice extends GenericSlice<IDobComentario> {
  constructor(private service: DobComentarioService) {
    super("DobComentario", service);
  }
  //nuevos asyncthunks aqui
  getListByDobPlanoIdRequest = createAsyncThunk<IDobComentario[], number>(
    `DobComentario/getListByDobPlanoIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByDobPlanoId(number), info);
    }
  );
}
export const DobComentarioSliceRequests = new dobComentarioClassSlice(dobComentarioService);

const initialState: IIniState<IDobComentario> = {
  loading: null,
  data: null
};

export const dobComentarioSlice = createSlice({
  name: "DobComentario",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobComentarioSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
