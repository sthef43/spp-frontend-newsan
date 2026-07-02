import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { XXE_WIP_ITF_SERIEService } from "app/services/xxe_wip_itf_serie.service";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
//<IAuth, IAuthUser>
const xxe_wip_itf_serieService = new XXE_WIP_ITF_SERIEService();

class XXE_WIP_ITF_SERIEClassSlice {
  constructor(private service: XXE_WIP_ITF_SERIEService) { }
  //Nuevos endpoints que no heredan de generic
  getAllByOp = createAsyncThunk<IXXE_WIP_ITF_SERIE[], { orgId; ope }>(
    `XXE_WIP_ITF_SERIE/GetAllByOp`,
    async (filters, info) => {
      return await errorNotification(() => this.service.getAllByOp(filters), info);
    }
  );

  GetByLPN = createAsyncThunk<IXXE_WIP_ITF_SERIE[], string>(
    "XXE_WIP_ITF_SERIE/GetByLPN",
    async (numberLPn, info) => {
      return await errorNotification(() => this.service.GetByLPN(numberLPn), info)
    }
  )

  getCountByOp = createAsyncThunk<number, string>(`XXE_WIP_ITF_SERIE/GetCountByOp`, async (op, info) => {
    return await errorNotification(() => this.service.getCountByOp(op), info);
  });

  getAllByFechaAndOp = createAsyncThunk<IXXE_WIP_ITF_SERIE[], { opes; fecha }>(
    `XXE_WIP_ITF_SERIE/GetAllByFechaAndOp`,
    async (opes, info) => {
      return await errorNotification(() => this.service.getAllByFechaAndOp(opes), info);
    }
  );
  multiPostRequest = createAsyncThunk<boolean, IXXE_WIP_ITF_SERIE[]>(
    `XXE_WIP_ITF_SERIE/MultiPostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.MultiPostRequest(modelo), info);
    }
  );

  getCountByOpAndTransOk = createAsyncThunk<number, { op; transOk; orgCode }>(
    `XXE_WIP_ITF_SERIE/GetCountByOp`,
    async (op, info) => {
      return await errorNotification(() => this.service.getCountByOpAndTransOk(op), info);
    }
  );
  GetByOp = createAsyncThunk<IXXE_WIP_ITF_SERIE, string>(`XXE_WIP_ITF_SERIE/GetByOp`, async (op, info) => {
    return await errorNotification(() => this.service.GetByOp(op), info);
  });
  getByLPNAndSerieRequest = createAsyncThunk<IXXE_WIP_ITF_SERIE, { lpn; serie }>(
    `XXE_WIP_ITF_SERIE/GetByLPNAndSerie`,
    async (model, info) => {
      return await errorNotification(() => this.service.GetByLPNAndSerie(model), info);
    }
  );
  getBySerieRequest = createAsyncThunk<IXXE_WIP_ITF_SERIE, string>(
    `XXE_WIP_ITF_SERIE/GetBySerie`,
    async (model, info) => {
      return await errorNotification(() => this.service.GetBySerie(model), info);
    }
  );
  getModeloBySerieRequest = createAsyncThunk<string, string>(
    `XXE_WIP_ITF_SERIE/GetModeloBySerie`,
    async (model, info) => {
      return await errorNotification(() => this.service.GetModeloBySerie(model), info);
    }
  );
}
export const XXE_WIP_ITF_SERIESliceRequests = new XXE_WIP_ITF_SERIEClassSlice(xxe_wip_itf_serieService);

const initialState: IIniState<IXXE_WIP_ITF_SERIE> = {
  loading: null,
  data: null
};

export const XXE_WIP_ITF_SERIESlice = createSlice({
  name: "XXE_WIP_ITF_SERIE",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IXXE_WIP_ITF_SERIE>) => {
      state.object = actions.payload;
    },
    setDataAll: (state, actions: PayloadAction<IXXE_WIP_ITF_SERIE[]>) => {
      state.dataAll = actions.payload;
    }
  },
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getAllByOp.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getAllByOp.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getAllByFechaAndOp.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getAllByFechaAndOp.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.multiPostRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.multiPostRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getByLPNAndSerieRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getByLPNAndSerieRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getBySerieRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.getBySerieRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.GetByLPN.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload
    })
    builder.addCase(XXE_WIP_ITF_SERIESliceRequests.GetByLPN.rejected, (state, action) => {
      state.loading = "rejected"
    })
  }
});
