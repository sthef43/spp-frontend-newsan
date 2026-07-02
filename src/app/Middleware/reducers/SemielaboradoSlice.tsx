import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { SemielaboradoService } from "app/services/semielaborado.service";
import { ISemielaborado } from "app/models/ISemielaborado";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const semielaboradoService = new SemielaboradoService();
class semielaboradoClassSlice extends GenericSlice<ISemielaborado> {
  constructor(private service: SemielaboradoService) {
    super("Semielaborado", service);
  }
  url = "Semielaborado";
  //nuevos asyncthunks aqui
  getAllByLineaIdRequest = createAsyncThunk<ISemielaborado[], number>(
    `${this.url}/GetAllByLineaId`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getAllByLineaId(lineaId), info);
    }
  );
}
export const SemielaboradoSliceRequests = new semielaboradoClassSlice(semielaboradoService);

const initialState: IIniState<ISemielaborado> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const semielaboradoSlice = createSlice({
  name: "Semielaborado",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SemielaboradoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(SemielaboradoSliceRequests.getAllByLineaIdRequest.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(SemielaboradoSliceRequests.getAllByLineaIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
