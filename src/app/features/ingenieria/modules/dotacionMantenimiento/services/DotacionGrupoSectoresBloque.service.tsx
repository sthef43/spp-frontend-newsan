import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IDotacionGrupoSectoresBloque } from "../models/IDotacionGrupoSectoresBloque";

export class DotacionGrupoSectoresBloqueService extends GenericService<IDotacionGrupoSectoresBloque> {
  Url = "DotacionGrupoSectoresBloque";
  constructor() {
    super("DotacionGrupoSectoresBloque");
  }

  public async PostNewBloq(sectorId: number, grupoId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/PostNewBloq/${sectorId}/${grupoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DeleteBloqBySectorAndGrupoId(sectorId: number, grupoId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .delete<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/DeleteBloqBySectorAndGrupoId/${sectorId}/${grupoId}`
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
