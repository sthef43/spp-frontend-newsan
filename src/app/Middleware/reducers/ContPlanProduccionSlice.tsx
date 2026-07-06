import { IContPlanProduccion } from "app/models/IContPlanProduccion";
import { ContPlanProduccionService } from "app/services/contPlanProduccion.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const contPlanProduccionService = new ContPlanProduccionService();
class contPlanProduccionClassSlice extends GenericSlice<IContPlanProduccion> {
  constructor(private service: ContPlanProduccionService) {
    super("ContPlanProduccion", service);
  }
  //nuevos asyncthunks aqui
  getListByPlantaLineaIdRequest = createAsyncThunk<IContPlanProduccion[], {contPlantaId; linea}>(
    `ContPlanProduccion/getListByPlantaLineaIdRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByPlantaLineaId(modelo), info);
    }
  );
  getListByPlantaIdRequest = createAsyncThunk<IContPlanProduccion[], number>(
    `ContPlanProduccion/getListByPlantaIdRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByPlantaId(modelo), info);
    }
  );
}
export const ContPlanProduccionSliceRequests = new contPlanProduccionClassSlice(contPlanProduccionService);

const initialState: IIniState<IContPlanProduccion> = {
  loading: null,
  data: null
};

export const contPlanProduccionSlice = createSlice({
  name: "ContPlanProduccion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContPlanProduccionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
