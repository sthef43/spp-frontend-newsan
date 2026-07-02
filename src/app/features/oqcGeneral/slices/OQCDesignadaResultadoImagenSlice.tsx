import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCDesignadaResultadoImagen } from "app/models/IOQCDesignadaResultadoImagen";
import { OQCDesignadaResultadoImagenService } from "app/features/oqcGeneral/services/oqcDesignadaResultadoImage.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcDesignadaResultadoImagenService = new OQCDesignadaResultadoImagenService();
class oqcDesignadaResultadoImagenClassSlice extends GenericSlice<IOQCDesignadaResultadoImagen> {
  constructor(private service: OQCDesignadaResultadoImagenService) {
    super("OQCDesignadaResultadoImagen", service);
  }
  //nuevos asyncthunks aqui
  uploadMultipleImageRequest = createAsyncThunk<
    boolean,
    Array<{ oqcDesigResultId: number; oqcBloqueGroupId: number; image: any }>
  >("OQCDesignadaResultadoImagen/UploadMultiple", async (model, info) => {
    return await errorNotification(() => this.service.uploadImages(model), info);
  });
}
export const OQCDesignadaResultadoImagenSliceRequests = new oqcDesignadaResultadoImagenClassSlice(
  oqcDesignadaResultadoImagenService
);

const initialState: IIniState<IOQCDesignadaResultadoImagen> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcDesignadaResultadoImagenSlice = createSlice({
  name: "OQCDesignadaResultadoImagen",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCDesignadaResultadoImagen>) => {
      state.object = actions.payload;
    },
    setOQC: (state, actions: PayloadAction<IOQCDesignadaResultadoImagen>) => {
      state.dataAll = [...state.dataAll, actions.payload];
    },
    setOQCArray: (state, actions: PayloadAction<IOQCDesignadaResultadoImagen[]>) => {
      state.dataAll = actions.payload;
    },
    setClear: (state) => {
      state.dataAll = [];
      state.object = null;
    }
  },
  extraReducers: (builder) => {
    OQCDesignadaResultadoImagenSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
