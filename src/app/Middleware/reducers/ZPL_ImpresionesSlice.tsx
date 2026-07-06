import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ZPL_ImpresionesService } from "app/services/zpl_impresiones.service";
import { IZPL_Impresiones } from "app/models/IZPL_Impresiones";
//<IAuth, IAuthUser>
const zpl_impreisonesService = new ZPL_ImpresionesService();

class ZPL_ImpresionesClassSlice {
  constructor(private service: ZPL_ImpresionesService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IZPL_Impresiones[]>(`ZPL_Impresiones/GetAll`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });
  getAllByTipoEtiquetaAndFamiliaId = createAsyncThunk<IZPL_Impresiones[], { tipoEtiqueta; productoId }>(
    `ZPL_Impresiones/GetAllByTipoEtiquetaAndFamiliaId`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByTipoEtiquetaAndFamiliaId(modelo), info);
    }
  );
  getAllByYear = createAsyncThunk<IZPL_Impresiones[], { tipoEtiqueta; familiaId; year }>(
    `ZPL_Impresiones/GetAllByYear`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByYear(modelo), info);
    }
  );
  getAllByMonthAndYear = createAsyncThunk<IZPL_Impresiones[], { tipoEtiqueta; familiaId; month; year }>(
    `ZPL_Impresiones/GetAllByMonthAndYear`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByMonthAndYear(modelo), info);
    }
  );
  getListByTipoEtiqueta = createAsyncThunk<IZPL_Impresiones[], number>(
    `ZPL_Impresiones/GetListByTipoEtiqueta`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getListByTipoEtiqueta(modelo), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IZPL_Impresiones>(`ZPL_Impresiones/PutRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.putRequest(modelo), info);
  });
  postRequest = createAsyncThunk<IZPL_Impresiones, IZPL_Impresiones>(
    `ZPL_Impresiones/PostRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );
  GetAllByTipoEtiquetaAndFamiliaAndPrefijo = createAsyncThunk<IZPL_Impresiones[], { tipoEtiqueta; familiaId; prefijo }>(
    `ZPL_Impresiones/GetAllByTipoEtiquetaAndFamiliaAndPrefijo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByTipoEtiquetaAndFamiliaAndPrefijo(modelo), info);
    }
  );
}
export const ZPL_ImpresionesSliceRequests = new ZPL_ImpresionesClassSlice(zpl_impreisonesService);

const initialState: IIniState<IZPL_Impresiones> = {
  loading: null,
  data: null
};

export const ZPL_ImpresionesSlice = createSlice({
  name: "ZPL_Impresiones",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
