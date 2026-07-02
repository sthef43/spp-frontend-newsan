import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCPaletPrint } from "app/models/IOQCPaletPrint";
import { OQCPaletPrintService } from "app/features/oqcGeneral/services/oqcPaletPrint.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcPaletPrintService = new OQCPaletPrintService();
class oqcPaletPrintClassSlice extends GenericSlice<IOQCPaletPrint> {
  constructor(private service: OQCPaletPrintService) {
    super("OQCPaletPrint", service);
  }
  //nuevos asyncthunks aqui
  getAllByPalet = createAsyncThunk<IOQCPaletPrint[], number>(`OQCPaletPrint/GetAllByModeloId`, async (id, info) => {
    return await errorNotification(() => this.service.GetAllByPalet(id), info);
  });
  postSimulation = createAsyncThunk<IOQCPaletPrint, IOQCPaletPrint>(
    `OQCPaletPrint/postSimulation`,
    async (model, info) => {
      return await errorNotification(() => this.service.postSimulation(model), info);
    }
  );
}
export const OQCPaletPrintSliceRequests = new oqcPaletPrintClassSlice(oqcPaletPrintService);

const initialState: IIniState<IOQCPaletPrint> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcPaletPrintSlice = createSlice({
  name: "OQCPaletPrint",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCPaletPrint>) => {
      state.object = actions.payload;
    },
    setArray: (state, actions: PayloadAction<IOQCPaletPrint[]>) => {
      state.dataAll = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCPaletPrintSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCPaletPrintSliceRequests.getAllByPalet.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCPaletPrintSliceRequests.getAllByPalet.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
