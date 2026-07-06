import { IIntDetalle } from "app/models/IIntDetalle";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IntDetalleService } from "app/services/intDetalle.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const intDetalleService = new IntDetalleService();
class intDetalleClassSlice extends GenericSlice<IIntDetalle> {
  constructor(private service: IntDetalleService) {
    super("IntDetalle", service);
  }
  //nuevos asyncthunks aqui
  getAllByIntRemitoIdRequest = createAsyncThunk<IIntDetalle[], number>(
    `IntDetalle/getAllByIntRemitoIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetAllByIntRemitoId(number), info);
    }
  );
}
export const IntDetalleSliceRequests = new intDetalleClassSlice(intDetalleService);

const initialState: IIniState<IIntDetalle> = {
  loading: null,
  data: null
};

export const intDetalleSlice = createSlice({
  name: "IntDetalle",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    IntDetalleSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
