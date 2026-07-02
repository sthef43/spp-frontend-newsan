import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models";
import { MinutasService } from "app/services/minutas.service";
import { IMinutas } from "app/models/IMinutas";

const minutasService = new MinutasService();
class minutasClassSlice extends GenericSlice<IMinutas> {
  constructor(private service: MinutasService) {
    super("Minutas", service);
  }
  //nuevos asyncthunks aqui
  getAllByLFRequest = createAsyncThunk<IMinutas[], { lineaId; fechaDesde; fechaHasta }>(
    `Minutas/getAllByLFRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByLF(modelo), info);
    }
  );
}
export const MinutasSliceRequests = new minutasClassSlice(minutasService);

const initialState: IIniState<IMinutas> = {
  loading: null,
  data: null
};

export const minutasSlice = createSlice({
  name: "Minutas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    MinutasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
