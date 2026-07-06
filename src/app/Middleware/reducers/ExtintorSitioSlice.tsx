import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models";
import { IExtintorSitio } from "app/models/IExtintorSitio";
import { ExtintorSitioService } from "app/services/extintorSitio.service";


const extintorSitioService = new ExtintorSitioService();
class extintorSitioClassSlice extends GenericSlice<IExtintorSitio> {
  constructor(private service: ExtintorSitioService) {
    super("ExtintorSitio", service);
  }
  //nuevos asyncthunks aqui
  getListByPlantRequest = createAsyncThunk<IExtintorSitio[], number>(
    `Extintor/getListByPlantRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByPlant(number), info);
    }
  );
}
export const ExtintorSitioSliceRequests = new extintorSitioClassSlice(extintorSitioService);

const initialState: IIniState<IExtintorSitio> = {
  loading: null,
  data: null
};

export const extintorSitioSlice = createSlice({
  name: "ExtintorSitio",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ExtintorSitioSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});