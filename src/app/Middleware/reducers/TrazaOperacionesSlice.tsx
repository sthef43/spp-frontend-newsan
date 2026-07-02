/* eslint-disable unused-imports/no-unused-vars */
import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { RenacerOperaciones, TrazaOperacionesService } from "app/services/trazaOperaciones.service";
import { ITrazaUnit } from "app/models/ITrazaUnit";
import { GenericSlice } from "./genericSlice";

import { ReporteRenacer } from "app/models/Stored Procdure/ReporteRenacer";
import { ReporteRenacerLpn } from "app/models/Stored Procdure/ReporteRenacerLpn";

import { RenacerExcelOperaciones } from "app/features/trazabilidad/modules/cargaProduccionRenacer/RenacerPage";
import { TrazaOperacionesWithOpDTO } from "app/models/DTO/TrazaOperacionesWithOpDTO";
import { IBateasDTO } from "app/features/produccion/modules/puestoTransferencia/models/IBateasDTO";
import { IBateasConCantidadDTO } from "app/features/produccion/modules/puestoTransferencia/models/IBateasConCantidadDTO";
import { TrazaOperacionWithOpAndLoteDTO } from "app/models/DTO/TrazaOperacionWithOpAndLoteDTO";

export interface AditionalStates<T> extends IIniState<TrazaOperaciones | ITrazaUnit[] | IBateasConCantidadDTO[]> {
  dataDto: IBateasConCantidadDTO[];
}
export interface trazaAutomotrizFetch {
  tipoBusqueda: number;
  codigo: string;
}

//<IAuth, IAuthUser>
const trazaOperacionesService = new TrazaOperacionesService();

class TrazaOperacionesClassSlice extends GenericSlice<TrazaOperaciones> {
  constructor(private service: TrazaOperacionesService) {
    super("TrazaOperaciones", service);
  }
  //Nuevos endpoints que no heredan de generic
  getHistorialByCodigo = createAsyncThunk<TrazaOperaciones, string>(
    `TrazaOperaciones2/getHistorialByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.getHistorialByCodigo(codigo), info);
    }
  );
  getByCodigo = createAsyncThunk<TrazaOperaciones, string>(`TrazaOperaciones2/GetByCodigo`, async (codigo, info) => {
    return await errorNotification(() => this.service.getByCodigo(codigo), info);
  });

  getOperacionRechazo = createAsyncThunk<TrazaOperaciones, string>(
    `TrazaOperaciones2/GetOperacionRechazo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.getOperacionRechazo(codigo), info);
    }
  );

  getHistorialByOperacionId = createAsyncThunk<TrazaOperaciones, number>(
    `TrazaOperaciones2/GetHistorialByOperacionId`,
    async (operacionId, info) => {
      return await errorNotification(() => this.service.GetHistorialByOperacionId(operacionId), info);
    }
  );
  getPiezasByOperacion = createAsyncThunk<ITrazaUnit[], number>(
    `TrazaOperaciones2/GetPiezasByOperacion`,
    async (operacionId, info) => {
      return await errorNotification(() => this.service.GetPiezasByOperacion(operacionId), info);
    }
  );
  getListByLineaPuestoAndFechaAndHora = createAsyncThunk<
    TrazaOperaciones[],
    { lineaPuestoId: number; fecha: string; horaDesde: number; horaHasta: number }
  >(`TrazaUnit_History2/getListByLineaPuestoAndFechaAndHora`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetListByLineaPuestoAndFechaAndHora(modelo), info);
  });
  GetCantidadByLineaPuesto = createAsyncThunk<
    TrazaOperaciones[],
    { lineaPuestoId: number; fecha: string; horaDesde: number; horaHasta: number; familia: string; modelo: string }
  >(`TrazaUnit_History2/GetCantidadByLineaPuesto`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetCantidadByLineaPuesto(modelo), info);
  });
  getAllByDateAndIden = createAsyncThunk<TrazaOperaciones[], string>(
    `TrazaOperaciones2/GetAllByDateAndIden`,
    async (fecha, info) => {
      return await errorNotification(() => this.service.GetAllByDateAndIden(fecha), info);
    }
  );
  getAllByIden = createAsyncThunk<TrazaOperaciones[]>(`TrazaOperaciones2/GetAllByIden`, async (fecha, info) => {
    return await errorNotification(() => this.service.GetAllByIden(), info);
  });
  getByFechaAndHours = createAsyncThunk<TrazaOperaciones[], { fecha: string; hours: string }>(
    `TrazaOperaciones2/GetByFechaAndHours`,
    async (object, info) => {
      return await errorNotification(() => this.service.GetByFechaAndHours(object.fecha, object.hours), info);
    }
  );
  getTotalRechazosByFamiliaRequest = createAsyncThunk<
    TrazaOperaciones[],
    { fecha: string; familia: string; lineaId: number; hours: string }
  >(`TrazaOperaciones2/GetTotalRechazosByFamilia`, async (object, info) => {
    return await errorNotification(() => this.service.GetTotalRechazosByFamilia(object), info);
  });
  desvincularOperacionByCodigo = createAsyncThunk<TrazaOperaciones, string>(
    `TrazaOperaciones2/DesvincularOperacionByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.DesvincularOperacionByCodigo(codigo), info);
    }
  );
  CambioCajaElectrica = createAsyncThunk<TrazaOperaciones, { piezaAnterior: string; piezaNueva: string }>(
    `TrazaOperaciones2/CambioCajaElectrica`,
    async (object, info) => {
      return await errorNotification(
        () => this.service.CambioCajaElectrica(object.piezaAnterior, object.piezaNueva),
        info
      );
    }
  );

  GetReporteRenacerByLpn = createAsyncThunk<ReporteRenacer[], { lpn: string }>(
    `TrazaOperaciones2/GetReporteTotalRenacer`,
    async (object, info) => {
      return await errorNotification(() => this.service.GetReporteRenacerByLpn(object), info);
    }
  );

  GetReporteTotalRenacer = createAsyncThunk<ReporteRenacerLpn[]>(
    `TrazaOperaciones2/GetReporteTotalRenacer`,
    async (object, info) => {
      return await errorNotification(() => this.service.GetReporteTotalRenacer(), info);
    }
  );

  GetRenacerOperacionesByLpn = createAsyncThunk<RenacerOperaciones[], string>(
    `TrazaOperaciones2/GetRenacerOperacionesByLpn`,
    async (object, info) => {
      return await errorNotification(() => this.service.GetRenacerOperacionesByLpn(object), info);
    }
  );

  ImportarRenacer = createAsyncThunk<boolean, RenacerExcelOperaciones[]>(
    `TrazaOperaciones2/ImportarRenacer`,
    async (object, info) => {
      return await errorNotification(() => this.service.ImportarRenacer(object), info);
    }
  );

  GetAllTracesByPuntDTO = createAsyncThunk<TrazaOperacionesWithOpDTO[], string>(
    `TrazaOperaciones2/GetAllTracesByPuntDTO`,
    async (codigoBatea, info) => {
      return await errorNotification(() => this.service.GetAllTracesByPuntDTO(codigoBatea), info);
    }
  );

  GetAllTracesByPunt = createAsyncThunk<TrazaOperaciones[], string>(
    `TrazaOperaciones2/GetAllTracesByPunt`,
    async (codigoBatea, info) => {
      return await errorNotification(() => this.service.GetAllTracesByPunt(codigoBatea), info);
    }
  );

  GetAllPuntIntoContainerById = createAsyncThunk<IBateasDTO[], number>(
    `TrazaOperaciones2/GetAllPuntIntoContainerById`,
    async (containerId, info) => {
      return await errorNotification(() => this.service.GetAllPuntIntoContainerById(containerId), info);
    }
  );

  GetAllCountTracesByContainerId = createAsyncThunk<number, number>(
    `TrazaOperaciones2/GetAllCountTracesByContainerId`,
    async (containerId, info) => {
      return await errorNotification(() => this.service.GetAllCountTracesByContainerId(containerId), info);
    }
  );

  GetAllPuntWithCountOfPlates = createAsyncThunk<IBateasConCantidadDTO[], { sectorId; puesto }>(
    `TrazaOperaciones2/GetAllPuntWithCountOfPlates`,
    async ({ sectorId, puesto }, info) => {
      return await errorNotification(() => this.service.GetAllPuntWithCountOfPlates(sectorId, puesto), info);
    }
  );

  GetByCodigoAllDatesOfTrace = createAsyncThunk<TrazaOperaciones, string>(
    `TrazaOperaciones2/GetByCodigoAllDatesOfTrace`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.GetByCodigoAllDatesOfTrace(codigo), info);
    }
  );

  GetAllDatesOfTraces = createAsyncThunk<TrazaOperaciones[], string[]>(
    `TrazaOperaciones2/GetAllDatesOfTraces`,
    async (listaTrazas, info) => {
      return await errorNotification(() => this.service.GetAllDatesOfTraces(listaTrazas), info);
    }
  );

  GetDatesOfPlateWithTrace = createAsyncThunk<TrazaOperacionWithOpAndLoteDTO, string>(
    `TrazaOperaciones2/GetDatesOfPlateWithTrace`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.GetDatesOfPlateWithTrace(codigo), info);
    }
  );

  GetTrazaAutomotriz = createAsyncThunk<TrazaOperaciones[], trazaAutomotrizFetch>(
    `TrazaOperaciones2/GetTrazaAutomotriz`,
    async (op, info) => {
      const { tipoBusqueda, codigo } = op;
      return await errorNotification(() => this.service.GetTrazaAutomotriz(tipoBusqueda, codigo), info);
    }
  );
}

export const TrazaOperacionesSliceRequests = new TrazaOperacionesClassSlice(trazaOperacionesService);

const initialState: AditionalStates<TrazaOperaciones | ITrazaUnit[] | IBateasConCantidadDTO[]> = {
  loading: null,
  dataAll: [],
  data: null,
  dataDto: []
};

export const TrazaOperacionSlice = createSlice({
  name: "TrazaOperaciones",
  initialState: initialState,
  reducers: {
    setTrazaPlaca: (state, action: PayloadAction<TrazaOperaciones>) => {
      state.object = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(TrazaOperacionesSliceRequests.getHistorialByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.data = action.payload;
      state.dataAll = [];
    });
    builder.addCase(TrazaOperacionesSliceRequests.getHistorialByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(TrazaOperacionesSliceRequests.getHistorialByOperacionId.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.data = action.payload;
      state.dataAll = [];
    });
    builder.addCase(TrazaOperacionesSliceRequests.getHistorialByOperacionId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TrazaOperacionesSliceRequests.desvincularOperacionByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.data = action.payload;
      state.dataAll = [];
    });
    builder.addCase(TrazaOperacionesSliceRequests.desvincularOperacionByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(TrazaOperacionesSliceRequests.getPiezasByOperacion.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.data = action.payload;
      state.dataAll = [];
    });
    builder.addCase(TrazaOperacionesSliceRequests.getPiezasByOperacion.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TrazaOperacionesSliceRequests.getAllByDateAndIden.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fulfiled";
    });
    builder.addCase(TrazaOperacionesSliceRequests.getAllByDateAndIden.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TrazaOperacionesSliceRequests.GetAllPuntWithCountOfPlates.fulfilled, (state, action) => {
      state.dataDto = action.payload;
      state.loading = "fulfiled";
    });
    builder.addCase(TrazaOperacionesSliceRequests.GetAllPuntWithCountOfPlates.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TrazaOperacionesSliceRequests.ImportarRenacer.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fulfiled";
    });
    builder.addCase(TrazaOperacionesSliceRequests.ImportarRenacer.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TrazaOperacionesSliceRequests.GetTrazaAutomotriz.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fulfiled";
    });
    builder.addCase(TrazaOperacionesSliceRequests.GetTrazaAutomotriz.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
