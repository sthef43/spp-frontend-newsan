import { GenericService } from "app/services/generic.service";
import { IAuditoriaTipo } from "../models/IAuditoriaTipo";
import axios from "axios";

export class AuditoriaTipoService extends GenericService<IAuditoriaTipo> {
  Url = "AuditoriaTipo";
  constructor() {
    super("AuditoriaTipo");
  }

  public async GetTiposByRolId(rolId: number): Promise<IAuditoriaTipo[]> {
    return new Promise<IAuditoriaTipo[]>((resolve, reject) => {
      axios
        .get<IAuditoriaTipo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetTiposByRolId/${rolId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetTiposByRolAndPlantId(rolId: number, plantId: number): Promise<IAuditoriaTipo[]> {
    return new Promise<IAuditoriaTipo[]>((resolve, reject) => {
      axios
        .get<IAuditoriaTipo[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetTiposByRolAndPlantId/${rolId}/${plantId}`
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
