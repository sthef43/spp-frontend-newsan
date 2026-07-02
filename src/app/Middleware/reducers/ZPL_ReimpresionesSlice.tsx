import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IZPL_Reimpresiones } from "app/models/IZPL_Reimpresiones";
import { ZPL_ReimpresionesService } from "app/services/zpl_Reimpresiones.service";
//<IAuth, IAuthUser>
const zpl_reimpreisonesService = new ZPL_ReimpresionesService();

class ZPL_ReimpresionesClassSlice {
  constructor(private service: ZPL_ReimpresionesService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IZPL_Reimpresiones[]>(`ZPL_Reimpresiones/GetAll`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });
  putRequest = createAsyncThunk<boolean, IZPL_Reimpresiones>(`ZPL_Reimpresiones/PutRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.putRequest(modelo), info);
  });
  postRequest = createAsyncThunk<IZPL_Reimpresiones, IZPL_Reimpresiones>(
    `ZPL_Reimpresiones/PostRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );
}
export const ZPL_ReimpresionesSliceRequests = new ZPL_ReimpresionesClassSlice(zpl_reimpreisonesService);

const initialState: IIniState<IZPL_Reimpresiones> = {
  loading: null,
  data: null
};

export const ZPL_ReimpresionesSlice = createSlice({
  name: "ZPL_Reimpresiones",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
