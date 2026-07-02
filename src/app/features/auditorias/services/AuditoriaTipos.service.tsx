import { GenericService } from "app/services/generic.service";
import { IAuditoriaTipos } from "../models/IAuditoriaTipos";
import axios from "axios";

export class AuditoriaTiposService extends GenericService<IAuditoriaTipos> {
  Url = "AuditoriaTipos";
  constructor() {
    super("AuditoriaTipos");
  }

  public async GetAllAuditTypesByRolId(rolId: number): Promise<IAuditoriaTipos[]> {
    return new Promise<IAuditoriaTipos[]>((resolve, reject) => {
      axios
        .get<IAuditoriaTipos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditTypesByRolId/${rolId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
