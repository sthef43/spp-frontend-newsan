import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IAndonPlacas } from "../models/IAndonPlacas";
import { AndonPlacasServices } from "../services/AndonPlacas.services";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { IIniState } from "app/models";

const andonPlacasService = new AndonPlacasServices();

class AndonPlacasClassSlice extends GenericSlice<IAndonPlacas> {
  constructor(private service: AndonPlacasServices) {
    super("CLIContenedorItemsRecepcionBloq", service);
  }

  GetAllPlaquesForSectorsAndForModels = createAsyncThunk<IAndonPlacas[]>(
    "CLIContenedorItemsRecepcionBloq/GetAllPlaquesForSectorsAndForModels",
    async (_, info) => {
      return await errorNotification(() => this.service.GetAllPlaquesForSectorsAndForModels(), info);
    }
  );
}

export const AndonPlacasSliceRequest = new AndonPlacasClassSlice(andonPlacasService);

const inititalState: IIniState<IAndonPlacas> = {
  loading: null,
  dataAll: [],
  data: null,
  object: null
};

export const AndonPlacasSlice = createSlice({
  name: "CLIContenedorItemsRecepcionBloq",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AndonPlacasSliceRequest.builderAll(builder);
    builder.addCase(AndonPlacasSliceRequest.GetAllPlaquesForSectorsAndForModels.fulfilled, (state, action) => {
      state.loading = ""; // ¡Fin de la carga exitoso!
      state.dataAll = action.payload;
    });
  }
});
