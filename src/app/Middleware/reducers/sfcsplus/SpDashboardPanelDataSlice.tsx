import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { SPDashboard_GetLinePanelDataSfcsplusService } from "app/services/sfcsplus/spDashboardPanelData.service";
import { ISPDashboardGetPanelData } from "app/models/sfcsplus/ISPDashboardGetPanelData";
//<IAuth, IAuthUser>
const spDashboardGetLinePanelDataPlusService = new SPDashboard_GetLinePanelDataSfcsplusService();

class SPDashboardGetPanelDataSfcsplusClassSlice {
  constructor(private service: SPDashboard_GetLinePanelDataSfcsplusService) {}
  //Nuevos endpoints que no heredan de generic
  GetListByPlantaId = createAsyncThunk<ISPDashboardGetPanelData, { lineaId; fecha }>(
    `ILineaSfcsplus/getListByPlantaId`,
    async (x, info) => {
      return await errorNotification(() => this.service.GetListByLineaId(x), info);
    }
  );
}
export const SPDashboard_GetPanelDataSfcsplusSliceRequests = new SPDashboardGetPanelDataSfcsplusClassSlice(
  spDashboardGetLinePanelDataPlusService
);
/* 
const initialState: IIniState<IZPL_TipoEtiquetas> = {
  loading: null,
  data: null
};

export const ZPL_TipoEtiquetasSlice = createSlice({
  name: "ZPL_TipoEtiquetas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
}); */
