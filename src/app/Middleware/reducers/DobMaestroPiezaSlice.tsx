import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { DobMaestroPiezaService } from "app/services/dobMaestroPieza.service";
import { IDobMaestroPieza } from "app/models/IDobMaestroPieza";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobMaestroPiezaService = new DobMaestroPiezaService();
class dobMaestroPiezaClassSlice extends GenericSlice<IDobMaestroPieza> {
  constructor(private service: DobMaestroPiezaService) {
    super("DobMaestroPieza", service);
  }
  //nuevos asyncthunks aqui

  GetByArticulo = createAsyncThunk<IDobMaestroPieza, string>(
    `DobMaestroPieza/GetByArticulo`,
    async (articulo, info) => {
      return await errorNotification(() => this.service.GetByArticulo(articulo), info);
    }
  );

  GetListByGenerico = createAsyncThunk<IDobMaestroPieza[], string>(
    `DobMaestroPieza/GetListByGenerico`,
    async (generico, info) => {
      return await errorNotification(() => this.service.GetListByGenerico(generico), info);
    }
  );

  GetAllGenericList = createAsyncThunk<IDobMaestroPieza[]>(
    `DobMaestroPieza/GetAllGenericList`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllGenericList(), info);
    }
  );
}
export const DobMaestroPiezaliceRequests = new dobMaestroPiezaClassSlice(dobMaestroPiezaService);

const initialState: IIniState<IDobMaestroPieza> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const DobMaestroPiezaSlice = createSlice({
  name: "DobMaestroPieza",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobMaestroPiezaliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
