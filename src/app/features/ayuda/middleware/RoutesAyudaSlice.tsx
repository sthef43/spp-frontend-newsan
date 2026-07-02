import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IRoutesAyuda } from "app/features/ayuda/models/IRoutesAyuda";
import { RoutesAyudaService } from "app/features/ayuda/services/routesAyuda.service";
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";

const routesAyudaService = new RoutesAyudaService();

class routesAyudaClassSlice extends GenericSlice<IRoutesAyuda> {
  constructor(private service: RoutesAyudaService) {
    super("RoutesAyuda", service);
  }

  UploadFile = createAsyncThunk<boolean, { ruta; padre; file; nombrePdf; routesAyudaPadresId }>(
    `RoutesAyuda/UploadFile`,
    async (x, info) => {
      return await errorNotification(
        () => this.service.UploadFile(x.ruta, x.padre, x.file, x.nombrePdf, x.routesAyudaPadresId),
        info
      );
    }
  );

  GetAllByPadre = createAsyncThunk<IRoutesAyuda[], string>(`RoutesAyuda/GetAllByPadre`, async (padre, info) => {
    return await errorNotification(() => this.service.GetAllByPadre(padre), info);
  });

  GetAllPadre = createAsyncThunk<IRoutesAyuda[]>(`RoutesAyuda/GetAllPadre`, async (x, info) => {
    return await errorNotification(() => this.service.GetAllPadre(), info);
  });
}

export const RoutesAyudaSliceRequest = new routesAyudaClassSlice(routesAyudaService);

const initialState: IIniState<IRoutesAyuda> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const routesAyudaSlice = createSlice({
  name: "RoutesAyuda",
  initialState: initialState,
  reducers: {
    findObject: (state, action: PayloadAction<number>) => {
      state.object = state.dataAll.find((items) => items.id == action.payload);
    }
  },
  extraReducers: (builder) => {
    RoutesAyudaSliceRequest.builderAll(builder);
  }
});
