import { IIntRemito } from "app/models/IIntRemito";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IntRemitoService } from "app/services/intRemito.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const intRemitoService = new IntRemitoService();
class intRemitoClassSlice extends GenericSlice<IIntRemito> {
  constructor(private service: IntRemitoService) {
    super("IntRemito", service);
  }
  //nuevos asyncthunks aqui
  getAllByFechaUserIdRequest = createAsyncThunk<IIntRemito[], { fechaDesde; fechaHasta; userId }>(
    `IntRemito/getAllByFechaUserIdRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByFechaUserId(modelo), info);
    }
  );
  getAllByIntRemitoPadreRequest = createAsyncThunk<IIntRemito[], number>(
    `IntRemito/getAllByIntRemitoPadreRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetAllByIntRemitoPadre(number), info);
    }
  );
  getByIdRemitoRequest = createAsyncThunk<IIntRemito, number>(
    `IntRemito/getByIdRemitoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetByIdRemito(number), info);
    }
  );
}
export const IntRemitoSliceRequests = new intRemitoClassSlice(intRemitoService);

const initialState: IIniState<IIntRemito> = {
  loading: null,
  data: null
};

export const intRemitoSlice = createSlice({
  name: "IntRemito",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    IntRemitoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
