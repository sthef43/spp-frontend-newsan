import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ScrapPlacasService, IScrapPlacas } from "../services/scrapPlacas.service";

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
