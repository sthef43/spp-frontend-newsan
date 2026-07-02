import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { PlantaSfcsplusService } from "app/services/sfcsplus/plantaSfcsplus.service";
import { IPlantaSfcsplus } from "app/models/sfcsplus/IPlantaSfcsplis";
//<IAuth, IAuthUser>
const plantaSfcsplusService = new PlantaSfcsplusService();

class PlantaSfcsplusClassSlice {
  constructor(private service: PlantaSfcsplusService) {}
  //Nuevos endpoints que no heredan de generic
  GetById = createAsyncThunk<IPlantaSfcsplus, number>(`PlantaSfcsplis/getById`, async (x, info) => {
    return await errorNotification(() => this.service.GetById(x), info);
  });
  GetByNombre = createAsyncThunk<IPlantaSfcsplus, string>(`PlantaSfcsplis/getByNombre`, async (x, info) => {
    return await errorNotification(() => this.service.GetByNombre(x), info);
  });
}
export const PlantaSfcsplusSliceRequests = new PlantaSfcsplusClassSlice(plantaSfcsplusService);
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
