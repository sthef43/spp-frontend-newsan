import { IDobHMaquina } from "app/models/IDobHMaquina";
import { DobHMaquinaService } from "app/services/dobHMaquina.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobHMaquinaService = new DobHMaquinaService();
class dobHMaquinaClassSlice extends GenericSlice<IDobHMaquina> {
  constructor(private service: DobHMaquinaService) {
    super("DobHMaquina", service);
  }
  //nuevos asyncthunks aqui
  getListDobHMaquina = createAsyncThunk<IDobHMaquina[]>(`DobHMaquina/getListDobHMaquina`, async (modelo, info) => {
    return await errorNotification(() => this.service.getListDobHMaquina(), info);
  });
}
export const DobHMaquinaSliceRequests = new dobHMaquinaClassSlice(dobHMaquinaService);

const initialState: IIniState<IDobHMaquina> = {
  loading: null,
  data: null
};

export const dobHMaquinaSlice = createSlice({
  name: "DobHMaquina",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHMaquinaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
