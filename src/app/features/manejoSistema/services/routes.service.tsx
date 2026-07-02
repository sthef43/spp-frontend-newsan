import { IRoutes } from "app/models/IRoutes";
import axios from "axios";
import { GenericService } from "../../../services/generic.service";

export class RoutesService extends GenericService<IRoutes> {
  Url = "Routes";
  constructor() {
    super("Routes");
  }

  public async GetRoutesByFatherName(nombrePadre: string, permisoId: number): Promise<IRoutes[]> {
    return new Promise<IRoutes[]>((resolve, reject) => {
      axios
        .get<IRoutes[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetRoutesByFatherName/${nombrePadre}/${permisoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
