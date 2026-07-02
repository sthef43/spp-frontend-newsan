import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models";
import { ExtintorProcesoService } from "app/services/extintorProceso.service";
import { IExtintorProceso } from "app/models/IExtintorProceso";


const extintorProcesoService = new ExtintorProcesoService();
class extintorProcesoClassSlice extends GenericSlice<IExtintorProceso> {
  constructor(private service: ExtintorProcesoService) {
    super("ExtintorProceso", service);
  }
  //nuevos asyncthunks aqui
  getListByPlantRequest = createAsyncThunk<IExtintorProceso[], number>(
    `Extintor/getListByPlantRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByPlant(number), info);
    }
  );
}
export const ExtintorProcesoSliceRequests = new extintorProcesoClassSlice(extintorProcesoService);

const initialState: IIniState<IExtintorProceso> = {
  loading: null,
  data: null
};

export const extintorProcesoSlice = createSlice({
  name: "ExtintorProceso",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ExtintorProcesoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});