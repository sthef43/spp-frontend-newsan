import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IRechazoDobladora } from "../Models/IRechazoDobladora";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { RechazoDobladoraService } from "../Services/rechazoDobladora.service";

const rechazoDobladoraService = new RechazoDobladoraService();

/**
 * Slice de Redux para gestionar el estado de RechazoDobladora.
 * Define los thunks para las operaciones asíncronas.
 */
class RechazoDobladoraClassSlice extends GenericSlice<IRechazoDobladora> {
  constructor(private service: RechazoDobladoraService) {
    super("RechazoDobladora", service);
  }

  PostNewRegister = createAsyncThunk<IRechazoDobladora, { entidad: IRechazoDobladora; file: File[] }>(
    `RechazoDobladora/PostNewRegister`,
    async ({ entidad, file }, info) => {
      return await errorNotification(() => this.service.PostNewRegister(entidad, file), info);
    }
  );

  GetAllRejectionByDates = createAsyncThunk<IRechazoDobladora[], { fechaDesde: string; fechaHasta: string }>(
    `RechazoDobladora/GetAllRejectionByDates`,
    async ({ fechaDesde, fechaHasta }, info) => {
      return await errorNotification(() => this.service.GetAllRejectionByDates(fechaDesde, fechaHasta), info);
    }
  );

  GetRejectionById = createAsyncThunk<IRechazoDobladora, number>(
    `RechazoDobladora/GetRejectionById`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetRejectionById(id), info);
    }
  );
}

export const RechazoDobladoraSliceRequest = new RechazoDobladoraClassSlice(rechazoDobladoraService);

const inititalState: IIniState<IRechazoDobladora> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const RechazoDobladoraSlice = createSlice({
  name: "RechazoDobladora",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    RechazoDobladoraSliceRequest.builderAll(builder);
  }
});
