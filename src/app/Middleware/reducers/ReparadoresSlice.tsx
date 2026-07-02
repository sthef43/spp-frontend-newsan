import { IReparadores } from "app/models/IReparadores";
import { ReparadoresService } from "app/services/reparadores.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";


const reparadoresService = new ReparadoresService();
class reparadoresClassSlice extends GenericSlice<IReparadores> {
  constructor(private service: ReparadoresService) {
    super("Reparadores", service);
  }
  //nuevos asyncthunks aqui
  getListByPlantIdRequest = createAsyncThunk<IReparadores[], number>(
    `Reparadores/getListByPlantIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByPlantId(number), info);
    }
  );
}
export const ReparadoresSliceRequests = new reparadoresClassSlice(reparadoresService);

const initialState: IIniState<IReparadores> = {
  loading: null,
  data: null
};

export const reparadoresSlice = createSlice({
  name: "Reparadores",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ReparadoresSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
