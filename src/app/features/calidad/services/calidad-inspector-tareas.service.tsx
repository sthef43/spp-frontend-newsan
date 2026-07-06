import { ICalidadInspectorTareas } from "app/models/ICalidadInspectorTareas";
import { GenericService } from "app/services/generic.service";
import axios from "axios";

export interface InspeccionesGroupedDTO {
  codigo: string;
  inspecciones: number;
  ultimaInspeccion?: Date;
}

export class CalidadInspectorTareasService extends GenericService<ICalidadInspectorTareas> {
  Url = "CalidadInspectorTareas";
  constructor() {
    super("CalidadInspectorTareas");
  }

  //Get Tareas By inspectorId

  GetTareasByInspectorId(inspectorId: number): Promise<ICalidadInspectorTareas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICalidadInspectorTareas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetTareas/${inspectorId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetInspeccionesGrouped(): Promise<InspeccionesGroupedDTO[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<InspeccionesGroupedDTO[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetInspeccionesGrouped`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
}
