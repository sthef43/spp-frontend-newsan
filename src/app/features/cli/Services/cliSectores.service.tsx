import { GenericService } from "app/services/generic.service";
import { ICLISectores } from "../Models/ICLISectores";
import axios from "axios";
import { JefeSectorCLI } from "app/models/DTO/JefeSectorCLI";

export class CliSectoresService extends GenericService<ICLISectores> {
  Url = "CLISectores";
  constructor() {
    super("CLISectores");
  }

  public getAllWithId(sectorId: number): Promise<ICLISectores[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLISectores[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllWithId/${sectorId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async GetAllSectorsByContainers(): Promise<ICLISectores[]> {
    return new Promise<ICLISectores[]>((resolve, reject) => {
      axios
        .get<ICLISectores[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllSectorsByContainers`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllNamesOfBossesBySectors(): Promise<JefeSectorCLI[]> {
    return new Promise<JefeSectorCLI[]>((resolve, reject) => {
      axios
        .get<JefeSectorCLI[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllNamesOfBossesBySectors`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetSectorByNameOfBoss(nombreJefe: string): Promise<ICLISectores> {
    return new Promise<ICLISectores>((resolve, reject) => {
      axios
        .get<ICLISectores>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetSectorByNameOfBoss/${nombreJefe}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
