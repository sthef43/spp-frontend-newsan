import { IDobHHistorial } from "app/models/IDobHHistorial";
import { DobHHistorialService } from "app/services/dobHHistorial.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobHHistorialService = new DobHHistorialService();
class dobHHistorialClassSlice extends GenericSlice<IDobHHistorial> {
  constructor(private service: DobHHistorialService) {
    super("DobHHistorial", service);
  }
  //nuevos asyncthunks aqui
  getListByDobHUbicacionIdRequest = createAsyncThunk<IDobHHistorial[], number>(
    `DobHHistorial/getListByDobHUbicacionIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByDobHUbicacionId(number), info);
    }
  );
  getListByDobHMaquinaIdRequest = createAsyncThunk<IDobHHistorial[], number>(
    `DobHHistorial/getListByDobHMaquinaIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByDobHMaquinaId(number), info);
    }
  );
  getListDobHHistorial = createAsyncThunk<IDobHHistorial[]>(`DobHHistorial/getListDobHHistorial`, async (modelo, info) => {
    return await errorNotification(() => this.service.getListDobHHistorial(), info);
  });
}
export const DobHHistorialSliceRequests = new dobHHistorialClassSlice(dobHHistorialService);

const initialState: IIniState<IDobHHistorial> = {
  loading: null,
  data: null
};

export const dobHHistorialSlice = createSlice({
  name: "DobHHistorial",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHHistorialSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
