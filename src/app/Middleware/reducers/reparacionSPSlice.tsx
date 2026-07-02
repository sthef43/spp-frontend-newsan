import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ReparacionSPService } from "app/services/reparacionSP.service";
import { ISPReparacion } from "app/models/ISPReparacion";
import { IReparacion } from "app/models/IReparacion";
import { ReparacionesByReparador } from "app/models/DTO/ReparacionesByReparadordto";
import { ReportePorPlanta } from "app/models/Stored Procdure/ReportePorPlanta";
//<IAuth, IAuthUser>
const reparacionSPService = new ReparacionSPService();

class ReparacionSPClassSlice {
  constructor(private service: ReparacionSPService) {}
  //Nuevos endpoints que no heredan de generic
  getReparacionesSP = createAsyncThunk<
    ISPReparacion[],
    { fechaDesde: string; fechaHasta: string; codigoError2: number; watchTurno: string }
  >(`Reparacion/getReparacionesSP`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetReparacionesSP(modelo), info);
  });

  getReparacionesByFechaAndLinea = createAsyncThunk<
    IReparacion[],
    { fechaDesde: string; fechaHasta: string; codigoError2: number }
  >(`Reparacion/getReparacionesByFechaAndLinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetReparacionesByFechaAndLinea(modelo), info);
  });

  GetAllReparacionesWithDates = createAsyncThunk<
    ReportePorPlanta[],
    { fechaDesde: string; fechaHasta: string}
  >(`Reparacion/GetAllReparacionesWithDates`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetAllReparacionesWithDates(modelo), info);
  });


  // ******************
  getReparacionesByFechaAndLineaAndOthers = createAsyncThunk<
    IReparacion[],
    { fechaDesde: string; fechaHasta: string; codigoError2: number; turno: string; tipo: string }
  >(`Reparacion/getReparacionesByFechaAndLineaAndOthers`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetReparacionesByFechaAndLineaAndOthers(modelo), info);
  });
  
  getListByCodigoTrazabilidad = createAsyncThunk<IReparacion[], { codigoTrazabilidad: string }>(
    `Reparacion/getListByCodigoTrazabilidad`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByCodigoTrazabilidad(modelo), info);
    }
  );

  GetAllCountByReparador = createAsyncThunk<ReparacionesByReparador[], { fechaDesde: string; fechaHasta: string; codigoError2: number; turno: string; tipo: string }>(
    `Reparacion/GetAllCountByReparador`, async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllCountByReparador(modelo), info)
    }
  )

  getInformeMensual = createAsyncThunk<any[], { month: number; year: number; codigoInicio: number; turno: string }>(
    `Reparacion/GetInformeMensual`,
    async (modelo, info) => {
      return await errorNotification(
        () => this.service.GetInformeMensual(modelo.month, modelo.year, modelo.codigoInicio, modelo.turno),
        info
      );
    }
  );
  GetCantReparacionesByFechaAndLineaHora = createAsyncThunk<
    any[],
    { fecha: string; codigoError2: string; horaDesde: string; horaHasta: string }
  >(`Reparacion/GetCantReparacionesByFechaAndLineaHora`, async (modelo, info) => {
    return await errorNotification(
      () =>
        this.service.GetCantReparacionesByFechaAndLineaHora(
          modelo.fecha,
          modelo.codigoError2,
          modelo.horaDesde,
          modelo.horaHasta
        ),
      info
    );
  });

  SearchTracesOfPlates = createAsyncThunk<string[], string[]>(
    `Reparacion/SearchTracesOfPlates`, async (codigoPlacas, info) => {
      return await errorNotification(() => this.service.SearchTracesOfPlates(codigoPlacas), info)
    }
  )
}
export const ReparacionSpSliceRequests = new ReparacionSPClassSlice(reparacionSPService);

const initialState: IIniState<ISPReparacion> = {
  loading: null,
  data: null
};

export const ReparacionSPSlice = createSlice({
  name: "ReparacionSP",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ReparacionSpSliceRequests.getReparacionesSP.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ReparacionSpSliceRequests.getReparacionesSP.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(ReparacionSpSliceRequests.getInformeMensual.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload.map((element, index) => ({ ...element, id: index }));
    });
    builder.addCase(ReparacionSpSliceRequests.getInformeMensual.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
