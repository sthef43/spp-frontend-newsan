import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { SumatoriaFieldTotal } from "../models/DTOS/SumatoriaFieldTotal";
import { IDotacionTareasResultados } from "../models/IDotacionTareasResultados";

export class DotacionTareasResultadosService extends GenericService<IDotacionTareasResultados> {
  Url = "DotacionTareasResultados";
  constructor() {
    super("DotacionTareasResultados");
  }

  public async GetAllTasksByDotacionId(
    dotacionId: number,
    sectorId: number,
    lineaTurnoField: string
  ): Promise<IDotacionTareasResultados[]> {
    return new Promise<IDotacionTareasResultados[]>((resolve, reject) => {
      axios
        .get<IDotacionTareasResultados[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllTasksByDotacionId/${dotacionId}/${sectorId}/${lineaTurnoField}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetTotalValuesOfTasks(dotacionId: number, lineaTurnoField: string): Promise<SumatoriaFieldTotal> {
    return new Promise<SumatoriaFieldTotal>((resolve, reject) => {
      axios
        .get<SumatoriaFieldTotal>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetTotalValuesOfTasks/${dotacionId}/${lineaTurnoField}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
