import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { OQCDesignadaService } from "app/features/oqcGeneral/services/oqcDesignada.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcDesignadaService = new OQCDesignadaService();
class oqcDesignadaClassSlice extends GenericSlice<IOQCDesignada> {
  constructor(private service: OQCDesignadaService) {
    super("OQCDesignada", service);
  }
  //nuevos asyncthunks aqui
  getAllByLineaIdAndTurnoRequest = createAsyncThunk<IOQCDesignada[], { lineaId: number; turnoId: number }>(
    `OQCDesignada/GetAllByLineaId`,
    async ({ lineaId, turnoId }, info) => {
      return await errorNotification(() => this.service.GetAllByLineaIdAndTurnoRequest(lineaId, turnoId), info);
    }
  );
  getAllByOQCIdRequest = createAsyncThunk<IOQCDesignada[], number>(
    `OQCDesignada/GetAllByOQCId`,
    async (oqcId, info) => {
      return await errorNotification(() => this.service.GetAllByOQCId(oqcId), info);
    }
  );
}
export const OQCDesignadaSliceRequests = new oqcDesignadaClassSlice(oqcDesignadaService);

const initialState: IIniState<IOQCDesignada> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcDesignadaSlice = createSlice({
  name: "OQCDesignada",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCDesignada>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCDesignadaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCDesignadaSliceRequests.getAllByLineaIdAndTurnoRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaSliceRequests.getAllByLineaIdAndTurnoRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCDesignadaSliceRequests.getAllByOQCIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaSliceRequests.getAllByOQCIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
