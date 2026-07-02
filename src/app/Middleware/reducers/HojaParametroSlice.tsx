import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { HojaParametroService } from "app/services/hojaParametro.service";
import { IHojaParametro } from "app/models/IHojaParametro";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const hojaParametroService = new HojaParametroService();
class hojaParametroClassSlice extends GenericSlice<IHojaParametro> {
  constructor(private service: HojaParametroService) {
    super("HojaParametro", service);
  }
  //nuevos asyncthunks aqui
  getListByEstadoRequest = createAsyncThunk<IHojaParametro[], {estado; productoId; familiaId}>(
    `HojaParametro/getListByEstadoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByEstado(modelo), info);
    }
  );
  getListByModeloIdRequest = createAsyncThunk<IHojaParametro[], number>(
    `HojaParametro/getListByModeloIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByModeloId(number), info);
    }
  );
}
export const HojaParametroSliceRequests = new hojaParametroClassSlice(hojaParametroService);

const initialState: IIniState<IHojaParametro> = {
  loading: null,
  data: null
};

export const hojaParametroSlice = createSlice({
  name: "HojaParametro",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    HojaParametroSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});

