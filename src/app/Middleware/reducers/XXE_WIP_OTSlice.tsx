import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";

import { IIniState } from "app/models/IIniState";
import { XXE_WIP_OTService } from "app/services/xxe_wip_ot.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";

import { ProductoTerminadoSemielaboradoDTO } from "app/models/DTO/ProductoTerminadoSemielaboradoDTO";
//<IAuth, IAuthUser>
const xxe_wip_otService = new XXE_WIP_OTService();

class XXE_WIP_OTClassSlice {
  constructor(private service: XXE_WIP_OTService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IXXE_WIP_OT[], string>(`XXE_WIP_OT/GetAllNuevasOp`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllRequest(modelo), info);
  });
  getAllTestRequest = createAsyncThunk<IXXE_WIP_OT[]>(`XXE_WIP_OT/GetAllNuevasOpTest`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllTestRequest(), thunk);
  });
  GetAllOPsForUse = createAsyncThunk<IXXE_WIP_OT[]>(`XXE_WIP_OT/GetAllOPsForUse`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllOPsForUse(), thunk);
  });
  GetAllByOrgId = createAsyncThunk<IXXE_WIP_OT[], string>(`XXE_WIP_OT/GetAllByOrgId`, async (orgId, info) => {
    return await errorNotification(() => this.service.GetAllByOrgId(orgId), info);
  });
  GetAllOrgId = createAsyncThunk<IXXE_WIP_OT[], string>(`XXE_WIP_OT/GetAllOrgId`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllOrgId(), thunk);
  });
  getCountByOp = createAsyncThunk<number, string>(`XXE_WIP_OT/GetCountByOp`, async (op, info) => {
    return await errorNotification(() => this.service.getCountByOp(op), info);
  });
  getListBySemielaboradoRequest = createAsyncThunk<IXXE_WIP_OT[], string>(
    `XXE_WIP_OT/GetListBySemielaborado`,
    async (op, info) => {
      return await errorNotification(() => this.service.getListBySemielaborado(op), info);
    }
  );
  getListRequest = createAsyncThunk<IXXE_WIP_OT[]>(`XXE_WIP_OT/getList`, async (op, info) => {
    return await errorNotification(() => this.service.getList(), info);
  });
  GetQuantityByOp = createAsyncThunk<number, string>(`XXE_WIP_OT/GetQuantityByOp`, async (op, info) => {
    return await errorNotification(() => this.service.GetQuantityByOp(op), info);
  });
  GetQuantityByOnlyOp = createAsyncThunk<number, string>(`XXE_WIP_OT/GetQuantityByOnlyOp`, async (op, info) => {
    return await errorNotification(() => this.service.GetQuantityByOnlyOp(op), info);
  });
  GetListByOrganizationCode = createAsyncThunk<IXXE_WIP_OT[], string>(
    `XXE_WIP_OT/GetListByOrganizationCode`,
    async (op, info) => {
      return await errorNotification(() => this.service.GetListByOrganizationCode(op), info);
    }
  );
  getCountByOP = createAsyncThunk<number, { op; orgCode }>(`XXE_WIP_OT/GetCountByOP`, async (op, info) => {
    return await errorNotification(() => this.service.GetCountByOP(op), info);
  });
  GetListByOrganizationCodeAndSemielaborado = createAsyncThunk<IXXE_WIP_OT[],ProductoTerminadoSemielaboradoDTO>(
  //----slice para semielaborado
    `XXE_WIP_OT/GetListByOrganizationCodeAndSemielaborado`,
    async (op,info) => {
      const {organizationCode, filters} = op;
      return await errorNotification(() => this.service.GetListByOrganizationCodeAndSemielaborado(organizationCode, filters), info);
    }
  );
  GetFamiliasDisponibles= createAsyncThunk<IXXE_WIP_OT[]>(
    //----slice get familias de la interfaz ot
    `XXE_WIP_OT/GetFamiliasDisponibles`,
    async(op, info) => {
      return await errorNotification(() => this.service.GetFamiliasDisponibles(),info); 
    }
  );
  GetOpDobladoraByFamilia = createAsyncThunk<IXXE_WIP_OT[],string>(
    `XXE_WIP_OT/GetProduccionFamilia`,
    async (op,info) => {
      return await errorNotification(() => this.service.GetOpsDobladoraByFamilia(op),info);
    }
  )
}
export const XXE_WIP_OTSliceRequests = new XXE_WIP_OTClassSlice(xxe_wip_otService);

const initialState: IIniState<IXXE_WIP_OT> = {
  loading: null,
  data: null
};

export const XXE_WIP_OTSlice = createSlice({
  name: "XXE_WIP_OT",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(XXE_WIP_OTSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_OTSliceRequests.getAllTestRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.getAllTestRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetAllOPsForUse.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetAllOPsForUse.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetAllByOrgId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetAllByOrgId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetAllOrgId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetAllOrgId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetListByOrganizationCodeAndSemielaborado.fulfilled,(state, action) =>{
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetListByOrganizationCodeAndSemielaborado.rejected,(state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetFamiliasDisponibles.fulfilled,(state,action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetFamiliasDisponibles.rejected,(state,action) => {
      state.loading = "rejected";
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetOpDobladoraByFamilia.fulfilled,(state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_OTSliceRequests.GetOpDobladoraByFamilia.rejected,(state,action) => {
      state.loading = "rejected";
    })
  }
});
