import { GenericService } from "app/services/generic.service";
import { IAuditoriaGrupoItemsResult } from "../models/IAuditoriaGrupoItemsResult";
import axios from "axios";

export class AuditoriaGrupoItemsResultService extends GenericService<IAuditoriaGrupoItemsResult> {
  Url = "AuditoriaGrupoItemsResult";
  constructor() {
    super("AuditoriaGrupoItemsResult");
  }

  public async GetAllGroupResultsByAuditId(auditoriaId: number) {
    return new Promise<IAuditoriaGrupoItemsResult[]>((resolve, reject) => {
      axios
        .get<IAuditoriaGrupoItemsResult[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllGroupResultsByAuditId/${auditoriaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DeleteGroupItemsGlobal(model: { AuditoriasIdPadre: number; nombreItem: string }): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .put(`${import.meta.env.VITE_API_URL}/${this.Url}/DeleteGroupItemsGlobal`, model)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
