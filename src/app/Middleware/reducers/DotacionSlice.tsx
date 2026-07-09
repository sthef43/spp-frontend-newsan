import { IDotacion } from "../../features/ingenieria/modules/dotacionMantenimiento/models/IDotacion";
import { GenericSlice } from "./genericSlice";
import { DotacionService } from "app/services/dotacion.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IDotacionGrupoSectoresBloque } from "app/features/ingenieria/modules/dotacionMantenimiento/models/IDotacionGrupoSectoresBloque";
import { DatosDotacionDto } from "app/features/ingenieria/modules/dotacionMantenimiento/models/DTOS/DatosDotacionDTO";

const dotacionService = new DotacionService();
class dotacionClassSlice extends GenericSlice<IDotacion> {
  constructor(private service: DotacionService) {
    super("Dotacion", service);
  }
  //nuevos asyncthunks aqui
  getAllByMPLPDHRequest = createAsyncThunk<IDotacion[], { modelo; proveedor; linea; potencia; fechaDesde; fechaHasta }>(
    `Dotacion/getAllByMPLPDHRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByMPLPDH(modelo), info);
    }
  );

  GetAllByDates = createAsyncThunk<IDotacion[], { fechaDesde; fechaHasta }>(
    `Dotacion/GetAllByDates`,
    async ({ fechaDesde, fechaHasta }, info) => {
      return await errorNotification(() => this.service.GetAllByDates(fechaDesde, fechaHasta), info);
    }
  );

  GetDotacionBySector = createAsyncThunk<IDotacionGrupoSectoresBloque[], number>(
    `Dotacion/GetDotacionBySector`,
    async (dotacionId, info) => {
      return await errorNotification(() => this.service.GetDotacionBySector(dotacionId), info);
    }
  );

  GetAllDotacionesGroup = createAsyncThunk<DatosDotacionDto, { fechaHasta; fechaDesde }>(
    `Dotacion/GetAllDotacionesGroup`,
    async ({ fechaHasta, fechaDesde }, info) => {
      return await errorNotification(() => this.service.GetAllDotacionesGroup(fechaDesde, fechaHasta), info);
    }
  );

  GetAllDotacionGroupInLine = createAsyncThunk<string[], { fechaHasta; fechaDesde }>(
    `Dotacion/GetAllDotacionGroupInLine`,
    async ({ fechaHasta, fechaDesde }, info) => {
      return await errorNotification(() => this.service.GetAllDotacionGroupInLine(fechaDesde, fechaHasta), info);
    }
  );

  SearchThatExistDotacion = createAsyncThunk<any, string>(
    `Dotacion/SearchThatExistDotacion`,
    async (todoEnUno, info) => {
      return await errorNotification(() => this.service.SearchThatExistDotacion(todoEnUno), info);
    }
  );

  PostNewDotacionWithNotExist = createAsyncThunk<IDotacion, IDotacion>(
    `Dotacion/PostNewDotacionWithNotExist`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.PostNewDotacionWithNotExist(modelo), info);
    }
  );
}
export const DotacionSliceRequests = new dotacionClassSlice(dotacionService);
