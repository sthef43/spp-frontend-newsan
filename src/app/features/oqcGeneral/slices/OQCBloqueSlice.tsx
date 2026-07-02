import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCBloque } from "app/models/IOQCBloque";
import { OQCBloqueService } from "app/features/oqcGeneral/services/oqcBloque.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcBloqueService = new OQCBloqueService();
class oqcBloqueClassSlice extends GenericSlice<IOQCBloque> {
  constructor(private service: OQCBloqueService) {
    super("OQCBloque", service);
  }
  //nuevos asyncthunks aqui
  getAllByProductoIdRequest = createAsyncThunk<IOQCBloque[], number>(
    `OQCBloque/GetAllByProductoId`,
    async (productoId, info) => {
      return await errorNotification(() => this.service.GetAllByProductoId(productoId), info);
    }
  );
}
export const OQCBloqueSliceRequests = new oqcBloqueClassSlice(oqcBloqueService);

const initialState: IIniState<IOQCBloque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcBloqueSlice = createSlice({
  name: "OQCBloque",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCBloque>) => {
      state.object = actions.payload;
    },
    filter: (state, actions: PayloadAction<number>) => {
      state.dataAll = state.dataAll.filter((st) => st.id != actions.payload);
    },
    filterArray: (state, actions: PayloadAction<number[]>) => {
      const ids = actions.payload;
      state.dataAll = state.dataAll.filter((st) => !ids.includes(st.id));
    },
    add: (state, actions: PayloadAction<IOQCBloque>) => {
      state.dataAll = [...state.dataAll, actions.payload];
    }
  },
  extraReducers: (builder) => {
    OQCBloqueSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCBloqueSliceRequests.getAllByProductoIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCBloqueSliceRequests.getAllByProductoIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
