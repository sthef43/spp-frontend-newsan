import { IScrapPlacas, ScrapPlacasService } from "../../services/scrapPlacas.service";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "../../models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const scrapPlacasService = new ScrapPlacasService();
class scrapPlacasClassSlice extends GenericSlice<IScrapPlacas> {
  constructor(private service: ScrapPlacasService) {
    super("ScrapPlacas", service);
  }
  getListByDesdeHastaRequest = createAsyncThunk<IScrapPlacas[], { fechaDesde: string; fechaHasta: string }>(
    `IScrapPlacas/getListByDesdeHasta`,
    async (modelo, thunk) => {
      return await errorNotification(() => this.service.GetListByDesdeHasta(modelo), thunk);
    }
  );
  getOpsByFamiliaRequest = createAsyncThunk<string[], string>(
    `IScrapPlacas/getOpsByFamilia`,
    async (familia, thunk) => {
      return await errorNotification(() => this.service.GetOpsByFamilia(familia), thunk);
    }
  );
  //nuevos asyncthunks aqui
}
export const ScrapPlacasSliceRequests = new scrapPlacasClassSlice(scrapPlacasService);

const initialState: IIniState<IScrapPlacas> = {
  loading: null,
  data: null
};

export const routesSlice = createSlice({
  name: "ScrapPlacas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ScrapPlacasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
