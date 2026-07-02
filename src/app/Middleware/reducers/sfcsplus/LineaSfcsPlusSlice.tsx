import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { LineaSfcsplusService } from "app/services/sfcsplus/lineaSfcsplus.service";
import { ILineaSfcsplus } from "app/models/sfcsplus/ILineaSfcsplis";
//<IAuth, IAuthUser>
const lineaSfcsplusService = new LineaSfcsplusService();

class LineaSfcsplusClassSlice {
  constructor(private service: LineaSfcsplusService) {}
  //Nuevos endpoints que no heredan de generic
  GetListByPlantaId = createAsyncThunk<ILineaSfcsplus[], number>(
    `ILineaSfcsplus/getListByPlantaId`,
    async (x, info) => {
      return await errorNotification(() => this.service.GetListByPlantaId(x), info);
    }
  );
}
export const LineaSfcsplusSliceRequests = new LineaSfcsplusClassSlice(lineaSfcsplusService);
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
