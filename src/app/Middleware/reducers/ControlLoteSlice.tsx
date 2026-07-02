import { IControlLote } from "app/models/IControlLote";

import { IIniState } from "app/models/IIniState";
import { ControlLoteService } from "app/services/controlLote.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ReprocesosAprobadosRechazadosDTO } from "app/models/DTO/ReprocesosAbradosRechazadosDTO";
//<IAuth, IAuthUser>
const planProdService = new ControlLoteService();

interface prop {
  modeloA: string;
  modeloB: string;
}

interface rechazosProp {
  estado: number;
  temporada: number;
}

class ControlLoteClassSlice {
  constructor(private service: ControlLoteService) { }
  //Nuevos endpoints que no heredan de generic
  getAllRechazosRequest = createAsyncThunk<IControlLote[], prop>(`ControlLote/GetAllRechazos`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllRechazosRequest(modelo.modeloA, modelo.modeloB), info);
  });

  getControlLoteByIdRequest = createAsyncThunk<IControlLote, number>(
    `ControlLote/GetControlLoteById`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getControlLoteByIdRequest(modelo), info);
    }
  );

  getAllRechazosByEstadoTemporadaRequest = createAsyncThunk<IControlLote[], rechazosProp>(
    `ControlLote/GetAllByEstadoTemporada`,
    async (modelo, info) => {
      return await errorNotification(
        () => this.service.getAllRechazosByEstadoTemporadaRequest(modelo.estado, modelo.temporada),
        info
      );
    }
  );

  getAllByLineaId = createAsyncThunk<IControlLote[], number>(`ControlLote/GetAllByLineaId`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByLineaId(modelo), info);
  });

  getAllRequest = createAsyncThunk<IControlLote[]>(`ControlLote/GetAll`, async (_info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });

  getAllTemporadasRequest = createAsyncThunk<any>(`ControlLote/GetAllTemporadas`, async (_info, thunk) => {
    return await errorNotification(() => this.service.getAllTemporadasRequest(), thunk);
  });

  postRequest = createAsyncThunk<IControlLote, IControlLote>(`ControlLote/PostRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.postRequest(modelo), info);
  });

  putRequest = createAsyncThunk<boolean, IControlLote>(`ControlLote/PutRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.putRequest(modelo), info);
  });

  deleteRequest = createAsyncThunk<boolean, number>(`ControlLote/DeleteRequest`, async (number, info) => {
    return await errorNotification(() => this.service.deleteRequest(number), info);
  });

  GetAllByLineaIdAndStateReprocesingIsS = createAsyncThunk<IControlLote[], number>(
    `ControlLote/GetAllByLineaIdAndStateReprocesingIsS`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.GetAllByLineaIdAndStateReprocesingIsS(lineaId), info);
    }
  );

  ReproessingApprovedAndRejected = createAsyncThunk<ReprocesosAprobadosRechazadosDTO, number>(
    `ControlLote/ReproessingApprovedAndRejected`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.ReproessingApprovedAndRejected(lineaId), info);
    }
  );

}
export const ControlLoteSliceRequests = new ControlLoteClassSlice(planProdService);

const initialState: IIniState<IControlLote> = {
  loading: null,
  data: null
};

export const ControlLoteSlice = createSlice({
  name: "ControlLote",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic

    builder.addCase(ControlLoteSliceRequests.getControlLoteByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.getControlLoteByIdRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.getAllRechazosRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.getAllRechazosRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.getAllTemporadasRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.getAllTemporadasRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.getAllRechazosByEstadoTemporadaRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.getAllRechazosByEstadoTemporadaRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.getAllByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.getAllByLineaId.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.postRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.putRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.deleteRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteSliceRequests.getAllRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
  }
});
