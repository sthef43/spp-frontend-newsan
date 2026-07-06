import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IntRemitoPadreService } from "app/services/intRemitoPadre.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const intRemitoPadreService = new IntRemitoPadreService();
class intRemitoPadreClassSlice extends GenericSlice<IIntRemitoPadre> {
  constructor(private service: IntRemitoPadreService) {
    super("IntRemitoPadre", service);
  }
  //nuevos asyncthunks aqui   
  getAllByEstadoOrigenDestinoRequest = createAsyncThunk<IIntRemitoPadre[], { intEstadoId; plantOrigenId; plantDestinoId }>(
    `IntRemitoPadre/getAllByEstadoOrigenDestinoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByEstadoOrigenDestino(modelo), info);
    }
  );
  getByPatenteEstadoRequest = createAsyncThunk<IIntRemitoPadre[], { patente; intEstadoId }>(
    `IntRemitoPadre/getByPatenteEstadoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByPatenteEstado(modelo), info);
    }
  );
  getByIdRemitoPadreRequest = createAsyncThunk<IIntRemitoPadre[], number>(
    `IntRemitoPadre/getByIdRemitoPadreRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetByIdRemitoPadre(number), info);
    }
  );
}
export const IntRemitoPadreSliceRequests = new intRemitoPadreClassSlice(intRemitoPadreService);

const initialState: IIniState<IIntRemitoPadre> = {
  loading: null,
  data: null
};

export const intRemitoPadreSlice = createSlice({
  name: "IntRemitoPadre",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    IntRemitoPadreSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
