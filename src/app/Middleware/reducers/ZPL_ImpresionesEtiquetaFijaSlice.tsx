import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IZPL_ImpresionesEtiquetaFija } from "app/models/IZPL_ImpresionesEtiquetaFija";
import { ZPL_ImpresionesEtiquetaFijaService } from "app/services/zpl_ImpresionesEtiquetaFija.service";
//<IAuth, IAuthUser>
const zpl_ImpresionesEtiquetaFijaService = new ZPL_ImpresionesEtiquetaFijaService();

class ZPL_ImpresionesEtiquetaFijaClassSlice {
  constructor(private service: ZPL_ImpresionesEtiquetaFijaService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IZPL_ImpresionesEtiquetaFija[]>(
    `ZPL_ImpresionesEtiquetaFija/getAllRequest`,
    async (x, info) => {
      return await errorNotification(() => this.service.getAllRequest(), info);
    }
  );
  getListByEtiquetaFijaId = createAsyncThunk<IZPL_ImpresionesEtiquetaFija[], number>(
    `ZPL_ImpresionesEtiquetaFija/GetListByEtiquetaFijaId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetListByEtiquetaFijaId(id), info);
    }
  );
  postRequest = createAsyncThunk<IZPL_ImpresionesEtiquetaFija, IZPL_ImpresionesEtiquetaFija>(
    `ZPL_ImpresionesEtiquetaFija/postRequest`,
    async (x, info) => {
      return await errorNotification(() => this.service.post(x), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IZPL_ImpresionesEtiquetaFija>(
    `ZPL_ImpresionesEtiquetaFija/putRequest`,
    async (x, info) => {
      return await errorNotification(() => this.service.put(x), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(`ZPL_ImpresionesEtiquetaFija/deleteRequest`, async (x, info) => {
    return await errorNotification(() => this.service.delete(x), info);
  });
}
export const ZPL_ImpresionesEtiquetaFijaSliceRequests = new ZPL_ImpresionesEtiquetaFijaClassSlice(
  zpl_ImpresionesEtiquetaFijaService
);

const initialState: IIniState<IZPL_ImpresionesEtiquetaFija> = {
  loading: null,
  data: null
};

export const ZPL_ImpresionesEtiquetaFijaSlice = createSlice({
  name: "ZPL_ImpresionesEtiquetaFija",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
