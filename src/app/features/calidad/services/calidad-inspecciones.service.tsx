import { ICalidadInspectorTareas } from "app/models/ICalidadInspectorTareas";
import axios from "axios";
import { GenericService } from "./generic.service";
import { IBaseEntity } from "app/models";
import { IRechazoMultiple } from "./rechazoMultiple.service";

export interface InspeccionesGroupedDTO {
  codigo: string;
  inspecciones: number;
  ultimaInspeccion?: Date;
}

export interface ICalidadInspecciones extends IBaseEntity {
  codigo: string;
  calidadInspectorTareasId: number;
  inspeccion: ICalidadInspectorTareas;
  estado: boolean;
  iniciado: boolean;
  finalizado: boolean;
  trazaOperaciones2Id: number;
  inspeccionVisual: string;
  inspeccionFuncional: string;
}

export interface ICalidadInspeccionRechazoMultiple extends IBaseEntity {
  rechazoMultipleId: number;
  rechazoMultiple: IRechazoMultiple;
  calidadInspeccionesId: number;
  tipo: string;
}

export class CalidadInspeccionesService extends GenericService<ICalidadInspecciones> {
  Url = "CalidadInspecciones";
  urlRechazos = "CalidadInspeccionRechazoMultiple";
  constructor() {
    super("CalidadInspecciones");
  }

  GetByCodigo(codigo: string): Promise<ICalidadInspecciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICalidadInspecciones[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByCodigo/${codigo}`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

  //Get Tareas By inspectorId

  GetInspeccionesGrouped(from: string, to: string): Promise<InspeccionesGroupedDTO[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<InspeccionesGroupedDTO[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetInspeccionesGrouped`, {
          params: {
            from,
            to
          }
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

  GetRechazosByInspeccionId(calidadInspeccionesId: number): Promise<ICalidadInspeccionRechazoMultiple[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICalidadInspeccionRechazoMultiple[]>(
          `${import.meta.env.VITE_API_URL}/${this.urlRechazos}/GetRechazosByInspeccionId/${calidadInspeccionesId}`
        )
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
}
