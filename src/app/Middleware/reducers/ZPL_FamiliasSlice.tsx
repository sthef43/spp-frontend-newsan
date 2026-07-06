import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ITipoEtiqueta } from "app/models/ITipoEtiqueta";
import { IZPL_Familias } from "app/models/IZPL_Familias";
import { ZPL_FamiliasService } from "app/services/zpl_Familias.service";
//<IAuth, IAuthUser>
const zpl_familiasService = new ZPL_FamiliasService();

class ZPL_FamiliasClassSlice {
  constructor(private service: ZPL_FamiliasService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<ITipoEtiqueta[]>(`ZPL_TipoEtiquetas/getAllRequest`, async (x, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });

  getRequest = createAsyncThunk<IZPL_Familias[]>(`ZPL_Familias/GetAll`, async (modelo, info) => {
    return await errorNotification(() => this.service.getRequest(), info);
  });
  putRequest = createAsyncThunk<boolean, IZPL_Familias>(`ZPL_Familias/PutRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.putRequest(modelo), info);
  });
  postRequest = createAsyncThunk<IZPL_Familias, IZPL_Familias>(`ZPL_Familias/PostRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.postRequest(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`ZPL_Familias/Delete`, async (modelo, info) => {
    return await errorNotification(() => this.service.deleteRequest(modelo), info);
  });
}
export const ZPL_FamiliasSliceRequests = new ZPL_FamiliasClassSlice(zpl_familiasService);

const initialState: IIniState<IZPL_Familias> = {
  loading: null,
  data: null
};

export const ZPL_FamiliasSlice = createSlice({
  name: "ZPL_Familias",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
