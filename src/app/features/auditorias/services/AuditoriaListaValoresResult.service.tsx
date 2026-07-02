import { GenericService } from "app/services/generic.service";
import { IAuditoriaListaValoresResult } from "../models/IAuditoriaListaValoresResult";
import axios from "axios";

export class AuditoriaListaValoresResultService extends GenericService<IAuditoriaListaValoresResult> {
  Url = "AuditoriaListaValoresResult";
  constructor() {
    super("AuditoriaListaValoresResult");
  }

  public async GetAllAuditsByRolId(idRol: number): Promise<IAuditoriaListaValoresResult[]> {
    return new Promise<IAuditoriaListaValoresResult[]>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditsByRolId/${idRol}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllListValuesByAuditId(idAudit: number): Promise<IAuditoriaListaValoresResult> {
    return new Promise<IAuditoriaListaValoresResult>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllListValuesByAuditId/${idAudit}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
