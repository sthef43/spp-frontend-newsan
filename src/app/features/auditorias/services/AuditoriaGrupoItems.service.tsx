import { GenericService } from "app/services/generic.service";
import { IAuditoriaGrupoItems } from "../models/IAuditoriaGrupoItems";
import axios from "axios";

export class AuditoriaGrupoItemsService extends GenericService<IAuditoriaGrupoItems> {
  Url = "AuditoriaGrupoItems";
  constructor() {
    super("AuditoriaGrupoItems");
  }

  public async GetAllGroupsByItems(): Promise<IAuditoriaGrupoItems[]> {
    return new Promise<IAuditoriaGrupoItems[]>((resolve, reject) => {
      axios
        .get<IAuditoriaGrupoItems[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllGroupsByItems`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
