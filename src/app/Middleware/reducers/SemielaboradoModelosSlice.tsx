import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { SemielaboradoModelosService } from "app/services/semielaboradoModelos.service";
import { ISemielaboradoModelos } from "app/models/ISemielaboradoModelos";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const semielaboradoModelosService = new SemielaboradoModelosService();
class semielaboradoModelosClassSlice extends GenericSlice<ISemielaboradoModelos> {
  constructor(private service: SemielaboradoModelosService) {
    super("SemielaboradoModelos", service);
  }
  url = "SemielaboradoModelos";
  getAllBySemiIdRequest = createAsyncThunk<ISemielaboradoModelos[], number>(
    `${this.url}/GetAllBySemiId`,
    async (id, info) => {
      return await errorNotification(() => this.service.getAllBySemiId(id), info);
    }
  );
  getByModeloAndSemielaboradoTipoIdRequest = createAsyncThunk<ISemielaboradoModelos, { modeloId; semielaboradoTipoId }>(
    `${this.url}/GetByModeloAndSemielaboradoTipoId`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByModeloAndSemielaboradoTipoId(modelo), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const SemielaboradoModelosSliceRequests = new semielaboradoModelosClassSlice(semielaboradoModelosService);

const initialState: IIniState<ISemielaboradoModelos> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const semielaboradoModelosSlice = createSlice({
  name: "SemielaboradoModelos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SemielaboradoModelosSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(SemielaboradoModelosSliceRequests.getAllBySemiIdRequest.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(SemielaboradoModelosSliceRequests.getAllBySemiIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
