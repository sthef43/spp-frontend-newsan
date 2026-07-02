import { IIniState } from "app/models";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICLIUbicacionSector } from "../Models/ICLIUbicacionSector";
import { CLIUbicacionesConItems } from "app/models/Stored Procdure/CLIUbicacionesConItems";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { CliUbicacionSectoresService } from "../Services/cliUbicacionSectores";

const cliUbicacionSectoresService = new CliUbicacionSectoresService();
class cliUbicacionSectorClassSlice extends GenericSlice<ICLIUbicacionSector> {
  constructor(private service: CliUbicacionSectoresService) {
    super("cliUbicacionesSectores", service);
  }
  //Nuevos asyncthunks aqui

  getAllWithIdSector = createAsyncThunk<ICLIUbicacionSector[], number>(
    `CLIUbicacionesSectores/GetAllWthSectorId`,
    async (sectorId, info) => {
      return await errorNotification(() => this.service.getAllWithIdSector(sectorId), info);
    }
  );
  getAllLocationWithoutSector = createAsyncThunk<ICLIUbicacionSector, string>(
    `CLIUbicacionesSectores/GetAllLocationWithoutSector`,
    async (x, info) => {
      return await errorNotification(() => this.service.getAllLocationWithoutSector(x), info);
    }
  );
  getUbicacionWithItemById = createAsyncThunk<ICLIUbicacionSector, number>(
    `CLIUbicacionesSectores/GetUbicacionWithItemById`,
    async (x, info) => {
      return await errorNotification(() => this.service.getUbicacionWithItemById(x), info);
    }
  );
  getAllUbicacionesWithItems = createAsyncThunk<CLIUbicacionesConItems[]>(
    `CLIUbicacionesSectores/getAllUbicacionesWithItems`,
    async (x, info) => {
      return await errorNotification(() => this.service.getAllUbicacionesWithItems(), info);
    }
  );
}

export const CLIUbicacionSectoresSliceRequest = new cliUbicacionSectorClassSlice(cliUbicacionSectoresService);

const initialState: IIniState<ICLIUbicacionSector> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const cliUbicacionSectoresSlice = createSlice({
  name: "cliUbicacionesSectores",
  initialState: initialState,
  reducers: {
    setDataAll: (state, action: PayloadAction<ICLIUbicacionSector[]>) => {
      state.dataAll = action.payload;
    }
  },
  extraReducers: (builder) => {
    CLIUbicacionSectoresSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(CLIUbicacionSectoresSliceRequest.getAllWithIdSector.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(CLIUbicacionSectoresSliceRequest.getAllWithIdSector.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(CLIUbicacionSectoresSliceRequest.getAllLocationWithoutSector.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(CLIUbicacionSectoresSliceRequest.getAllLocationWithoutSector.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
