import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { DatosTareasConResultadosDTO } from "../models/DTOS/DatosTareasConResultadosDTO";
import { IDotacionTareas } from "../models/IDotacionTareas";

export class DotacionTareasService extends GenericService<IDotacionTareas> {
  Url = "DotacionTareas";
  constructor() {
    super("DotacionTareas");
  }

  public async GetAllBySectorId(sectorId: number): Promise<IDotacionTareas[]> {
    return new Promise<IDotacionTareas[]>((resolve, reject) => {
      axios
        .get<IDotacionTareas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllBySectorId/${sectorId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTareasWithValue(
    sectorId: number,
    dotacionId: number,
    lineaTurnoField: string
  ): Promise<DatosTareasConResultadosDTO[]> {
    return new Promise<DatosTareasConResultadosDTO[]>((resolve, reject) => {
      axios
        .get<DatosTareasConResultadosDTO[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllTareasWithValue/${sectorId}/${dotacionId}/${lineaTurnoField}`
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
