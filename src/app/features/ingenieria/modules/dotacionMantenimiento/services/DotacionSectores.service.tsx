import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IDotacionSector } from "../models/IDotacionSector";

export class DotacionSectorService extends GenericService<IDotacionSector> {
  Url = "DotacionSector";
  constructor() {
    super("DotacionSector");
  }

  public async GetAllWithGroup(grupoId: number): Promise<IDotacionSector[]> {
    return new Promise<IDotacionSector[]>((resolve, reject) => {
      axios
        .get<IDotacionSector[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWithGroup/${grupoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsWithoutGroup(grupoId: number): Promise<IDotacionSector[]> {
    return new Promise<IDotacionSector[]>((resolve, reject) => {
      axios
        .get<IDotacionSector[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsWithoutGroup/${grupoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
