import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { CalidadDocumentService } from "app/services/calidadDocument.service";
import { ICalidadDocument } from "app/models/ICalidadDocument";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const calidadDocumentService = new CalidadDocumentService();
class calidadDocumentClassSlice extends GenericSlice<ICalidadDocument> {
  constructor(private service: CalidadDocumentService) {
    super("CalidadDocument", service);
  }
  //nuevos asyncthunks aqui
  getByPlPrFaMoSIARequest = createAsyncThunk<ICalidadDocument[], {plantId, productoId, familiaId, modeloId, semielaboradoIAId}>(
    `CalidadDocument/getByPlPrFaMoSIARequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByPlPrFaMoSIA(modelo), info);
    }
  );
}
export const CalidadDocumentSliceRequests = new calidadDocumentClassSlice(calidadDocumentService);

const initialState: IIniState<ICalidadDocument> = {
  loading: null,
  data: null
};

export const calidadDocumentSlice = createSlice({
  name: "CalidadDocument",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CalidadDocumentSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});