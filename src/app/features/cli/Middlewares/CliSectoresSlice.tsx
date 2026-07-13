import { IIniState } from "app/models";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICLISectores } from "../Models/ICLISectores";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { JefeSectorCLI } from "app/models/DTO/JefeSectorCLI";
import { CliSectoresService } from "../Services/cliSectores.service";

const cliSectoresService = new CliSectoresService();
class cliSectoresClassSlice extends GenericSlice<ICLISectores> {
  constructor(private service: CliSectoresService) {
    super("CLISectores", service);
  }
  //Nuevos asyncthunks aqui

  getAllWithId = createAsyncThunk<ICLISectores[], number>(`CLISectores/GetAllWithId`, async (sectorId, info) => {
    return await errorNotification(() => this.service.getAllWithId(sectorId), info);
  });

  GetAllSectorsByContainers = createAsyncThunk<ICLISectores[]>(
    `CLISectores/GetAllSectorsByContainers`,
    async (_, info) => {
      return await errorNotification(() => this.service.GetAllSectorsByContainers(), info);
    }
  );

  GetAllNamesOfBossesBySectors = createAsyncThunk<JefeSectorCLI[]>(
    `CLISectores/GetAllNamesOfBossesBySectors`,
    async (_, info) => {
      return await errorNotification(() => this.service.GetAllNamesOfBossesBySectors(), info);
    }
  );

  GetSectorByNameOfBoss = createAsyncThunk<ICLISectores, string>(
    `CLISectores/GetSectorByNameOfBoss`,
    async (nombreJefe, info) => {
      return await errorNotification(() => this.service.GetSectorByNameOfBoss(nombreJefe), info);
    }
  );
}

export const CLISectoresSliceRequest = new cliSectoresClassSlice(cliSectoresService);

const initialState: IIniState<ICLISectores> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const cliSectoresSlice = createSlice({
  name: "CLISectores",
  initialState: initialState,
  reducers: {
    setSelectUbicacion: (state, action: PayloadAction<number>) => {
      state.object = state.dataAll.find((sector) => sector.id === action.payload);
    },
    setObject: (state, action: PayloadAction<number>) => {
      state.object = state.dataAll.find((elementos) => elementos.id === action.payload);
    }
  },
  extraReducers: (builder) => {
    CLISectoresSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(CLISectoresSliceRequest.getAllWithId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(CLISectoresSliceRequest.getAllWithId.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(CLISectoresSliceRequest.GetAllSectorsByContainers.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(CLISectoresSliceRequest.GetAllSectorsByContainers.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
