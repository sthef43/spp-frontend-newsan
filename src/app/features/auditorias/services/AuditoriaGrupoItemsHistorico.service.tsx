import { GenericService } from "app/services/generic.service";
import { IAuditoriaGrupoItemsHistorico } from "../models/IAuditoriaGrupoItemsHistorico";
import axios from "axios";

export class AuditoriaGrupoItemsHistoricoService extends GenericService<IAuditoriaGrupoItemsHistorico> {
  Url = "AuditoriaGrupoItemsHistorico";
  constructor() {
    super("AuditoriaGrupoItemsHistorico");
  }

  public async MultiPostWithImages(
    auditoriaHistoricoId: number,
    idsGrupos: number[],
    listaArchivos: File[]
  ): Promise<boolean> {
    const formData = new FormData();
    formData.append("auditoriaHistoricoId", auditoriaHistoricoId.toString());
    idsGrupos.forEach((elementos) => {
      formData.append("idsGrupos", elementos.toString());
    });
    listaArchivos.forEach((elementos) => {
      formData.append("listaArchivosUpload", elementos);
    });
    console.log(formData);
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPostWithImages`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async MultiPostReturnList(entidad: IAuditoriaGrupoItemsHistorico[]): Promise<IAuditoriaGrupoItemsHistorico[]> {
    return new Promise<IAuditoriaGrupoItemsHistorico[]>((resolve, reject) => {
      axios
        .post<IAuditoriaGrupoItemsHistorico[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/MultiPostReturnList`,
          entidad
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
