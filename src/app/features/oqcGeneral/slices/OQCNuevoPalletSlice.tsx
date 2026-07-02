import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { OQCNuevoPalletService } from "app/features/oqcGeneral/services/oqcNuevoPallet.service";
import { IIniState } from "app/models";
import { IOQCNuevoPallet } from "app/models/IOQCNuevoPallet";

const oqcNuevoPalletService = new OQCNuevoPalletService();

class oqcNuevoPalletClassSlice extends GenericSlice<IOQCNuevoPallet> {
  constructor(private service: OQCNuevoPalletService) {
    super("OQCNuevoPallet", service);
  }

  GetAllByLpn = createAsyncThunk<IOQCNuevoPallet[], string>(`OQCNuevoPallet/GetAllByLpn`, async (Lpn, info) => {
    return await errorNotification(() => this.service.GetAllByLpn(Lpn), info);
  });
  GetAllByPaletId = createAsyncThunk<IOQCNuevoPallet[], number>(
    `OQCNuevoPallet/GetAllByPaletId`,
    async (paletId, info) => {
      return await errorNotification(() => this.service.GetAllByPaletId(paletId), info);
    }
  );
  GetAllByCodeReferencia = createAsyncThunk<IOQCNuevoPallet, string>(
    `OQCNuevoPallet/GetAllByCodeReferencia`,
    async (referenciaCode, info) => {
      return await errorNotification(() => this.service.GetByReferenciaCode(referenciaCode), info);
    }
  );
}
export const OQCNuevoPalletSliceRequest = new oqcNuevoPalletClassSlice(oqcNuevoPalletService);

const initialState: IIniState<IOQCNuevoPallet> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcNuevoPalletSlice = createSlice({
  name: "OQCNuevoPallet",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCNuevoPallet>) => {
      state.object = actions.payload;
    },
    setDataAll: (state, actions: PayloadAction<IOQCNuevoPallet[]>) => {
      state.dataAll = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCNuevoPalletSliceRequest.builderAll(builder);
    builder.addCase(OQCNuevoPalletSliceRequest.GetAllByLpn.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCNuevoPalletSliceRequest.GetAllByLpn.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCNuevoPalletSliceRequest.GetAllByPaletId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCNuevoPalletSliceRequest.GetAllByPaletId.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
