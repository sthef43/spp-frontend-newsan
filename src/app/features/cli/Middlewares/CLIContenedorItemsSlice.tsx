/* eslint-disable unused-imports/no-unused-vars */
import { IIniState } from "app/models";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICLIContendorItems } from "../Models/ICLIContenedorItems";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { CLIIContenedorItemsService } from "../Services/cliCotenedorItems.service";

const cliContenedorItemsService = new CLIIContenedorItemsService();
class cliContenedorClassSlice {
  url = "CLIContenedorItems";
  constructor(private service: CLIIContenedorItemsService) {}
  //nuevos asyncthunks aqui
  GetAllRequest = createAsyncThunk<ICLIContendorItems[]>(`${this.url}/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAll(), thunk);
  });
  GetById = createAsyncThunk<ICLIContendorItems, number>(`${this.url}/GetById`, async (info, thunk) => {
    return await errorNotification(() => this.service.getById(info), thunk);
  });
  GetAllWithItemsId = createAsyncThunk<ICLIContendorItems, number>(
    `${this.url}/GetAllWithItemsId`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getAllWithItemsId(info), thunk);
    }
  );
  GetByLocalizadorId = createAsyncThunk<ICLIContendorItems, number>(
    `${this.url}/GetByLocalizadorId`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getByLocalizadorId(info), thunk);
    }
  );
  GetAllWithItemsLPN = createAsyncThunk<ICLIContendorItems, string>(
    `${this.url}/GetAllWithItemsLPN`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getAllWithItemsLpn(info), thunk);
    }
  );
  PostRequest = createAsyncThunk<boolean, ICLIContendorItems>(`${this.url}/Post`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  PutRequest = createAsyncThunk<boolean, ICLIContendorItems>(`${this.url}/Put`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  DeleteRequest = createAsyncThunk<boolean, number>(`${this.url}/Delete`, async (id, info) => {
    return await errorNotification(() => this.service.deleteRequest(id), info);
  });
  GetByOptionLpn = createAsyncThunk<ICLIContendorItems[], string>(
    `CLIContenedorItems/GetByOptionLpn`,
    async (opcionGenerada, info) => {
      return await errorNotification(() => this.service.GetByOptionLpn(opcionGenerada), info);
    }
  );
  PutModel = createAsyncThunk<ICLIContendorItems, ICLIContendorItems>(
    `CLIContenedorItems/PutModel`,
    async (opcionGenerada, info) => {
      return await errorNotification(() => this.service.PutModel(opcionGenerada), info);
    }
  );
  GetContainerByLPN = createAsyncThunk<ICLIContendorItems, string>(
    `CLIContenedorItems/GetContainerByLPN`,
    async (lpnGenerada, info) => {
      return await errorNotification(() => this.service.GetContainerByLPN(lpnGenerada), info);
    }
  );
  GetAllContainersBySectorId = createAsyncThunk<ICLIContendorItems[], number>(
    `CLIContenedorItems/GetAllContainersBySectorId`,
    async (sectorId, info) => {
      return await errorNotification(() => this.service.GetAllContainersBySectorId(sectorId), info);
    }
  );
  GetContenedorById = createAsyncThunk<ICLIContendorItems, number>(
    `CLIContenedorItems/GetContenedorById`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetContenedorById(id), info);
    }
  );
}

export const CLIContenedorItemsSliceRequest = new cliContenedorClassSlice(cliContenedorItemsService);

const initialState: IIniState<ICLIContendorItems> = {
  loading: null,
  data: null,
  dataAll: []
};

export const CLIContenedorItemsSlice = createSlice({
  name: "CLIContenedorItems",
  initialState: initialState,
  reducers: {
    setContenedorObject: (state, action: PayloadAction<ICLIContendorItems>) => {
      state.object = action.payload;
    }
  },
  extraReducers: (builder) => {
    // CLIContenedorItemsSliceRequest.builderAll(builder);
    builder.addCase(CLIContenedorItemsSliceRequest.GetByOptionLpn.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CLIContenedorItemsSliceRequest.GetByOptionLpn.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(CLIContenedorItemsSliceRequest.GetContainerByLPN.fulfilled, (state, action) => {
      state.object = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CLIContenedorItemsSliceRequest.GetContainerByLPN.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
