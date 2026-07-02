import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { OQCHallazgoResultService } from "app/features/oqcGeneral/services/oqcHallazgoResult.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcHallazgoResultService = new OQCHallazgoResultService();
class oqcHallazgoResultClassSlice extends GenericSlice<IOQCHallazgoResult> {
  constructor(private service: OQCHallazgoResultService) {
    super("OQCHallazgoResult", service);
  }
  //nuevos asyncthunks aqui
  getAllByOQCDesResIdRequest = createAsyncThunk<IOQCHallazgoResult[], number>(
    `OQCHallazgoResult/GetAllByOQCId`,
    async (oqcId, info) => {
      return await errorNotification(() => this.service.GetAllByOQCId(oqcId), info);
    }
  );
}
export const OQCHallazgoResultSliceRequests = new oqcHallazgoResultClassSlice(oqcHallazgoResultService);

const initialState: IIniState<IOQCHallazgoResult> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcHallazgoResultSlice = createSlice({
  name: "OQCHallazgoResult",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCHallazgoResult>) => {
      state.object = actions.payload;
    },
    setNewOQC: (state, actions: PayloadAction<IOQCHallazgoResult>) => {
      state.dataAll = [...state.dataAll, actions.payload];
    },
    setNewOQCArray: (state, actions: PayloadAction<IOQCHallazgoResult[]>) => {
      state.dataAll = [...state.dataAll, ...actions.payload];
    },
    setNewState: (state, actions: PayloadAction<{ state: boolean; id: number }>) => {
      const indx = state.dataAll.findIndex((oqcHR) => oqcHR.oqcBloqueHallazgoId == actions.payload.id);
      state.dataAll[indx].state = actions.payload.state;
    },
    setNewComent: (state, actions: PayloadAction<{ comentario: string; id: number }>) => {
      const indx = state.dataAll.findIndex((oqcHR) => oqcHR.oqcBloqueHallazgoId == actions.payload.id);
      state.dataAll[indx].comentario = actions.payload.comentario;
    },
    setClear: (state) => {
      state.dataAll = [];
      state.object = null;
    }
  },
  extraReducers: (builder) => {
    OQCHallazgoResultSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCHallazgoResultSliceRequests.getAllByOQCDesResIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCHallazgoResultSliceRequests.getAllByOQCDesResIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
