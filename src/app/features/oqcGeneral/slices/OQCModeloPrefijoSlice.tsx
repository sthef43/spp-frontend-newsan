import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCModeloPrefijo } from "app/models/IOQCModeloPrefijo";
import { OQCModeloPrefijoService } from "app/features/oqcGeneral/services/oqcModeloPrefijo.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcModeloPrefijoService = new OQCModeloPrefijoService();
class oqcModeloPrefijoClassSlice extends GenericSlice<IOQCModeloPrefijo> {
  constructor(private service: OQCModeloPrefijoService) {
    super("OQCModeloPrefijo", service);
  }
  //nuevos asyncthunks aqui
  getListByPrefijoRequest = createAsyncThunk<IOQCModeloPrefijo[], string>(
    `OQCModeloPrefijo/GetListByPrefijo`,
    async (prefijo, info) => {
      return await errorNotification(() => this.service.GetListByPrefijo(prefijo), info);
    }
  );
}
export const OQCModeloPrefijoSliceRequests = new oqcModeloPrefijoClassSlice(oqcModeloPrefijoService);

const initialState: IIniState<IOQCModeloPrefijo> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcModeloPrefijoSlice = createSlice({
  name: "OQCModeloPrefijo",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCModeloPrefijo>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCModeloPrefijoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCModeloPrefijoSliceRequests.getListByPrefijoRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCModeloPrefijoSliceRequests.getListByPrefijoRequest.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
