import { GenericService } from "app/services/generic.service";
import { ICLIUbicacionSector } from "../Models/ICLIUbicacionSector";
import axios from "axios";
import { CLIUbicacionesConItems } from "app/models/Stored Procdure/CLIUbicacionesConItems";

export class CliUbicacionSectoresService extends GenericService<ICLIUbicacionSector> {
  Url = "CLIUbicacionesSectores";
  constructor() {
    super("CLIUbicacionesSectores");
  }

  public getAllWithIdSector(sectorId: number): Promise<ICLIUbicacionSector[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIUbicacionSector[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWthSectorId/${sectorId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllLocationWithoutSector(localizador: string): Promise<ICLIUbicacionSector> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIUbicacionSector>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllLocationWithoutSector/${localizador}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getUbicacionWithItemById(id: number): Promise<ICLIUbicacionSector> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIUbicacionSector>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUbicacionWithItemById/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllUbicacionesWithItems(): Promise<CLIUbicacionesConItems[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<CLIUbicacionesConItems[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllUbicacionesWithItems`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
