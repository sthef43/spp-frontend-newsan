import { RutasConPadresDTO } from "app/models/DTO/RutasConPadresDTO";
import { IPermisosRoutes } from "app/models/IPermisosRoutes";
import axios from "axios";
import { GenericService } from "../../../services/generic.service";

export class PermisosRoutesService extends GenericService<IPermisosRoutes> {
  Url = "PermisosRoutes";
  constructor() {
    super("PermisosRoutes");
  }
  public getAllByPermisos(id: number): Promise<IPermisosRoutes[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPermisosRoutes[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByPermisos/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async GetAllFathersRoutesByPermisoId(permisoId: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      axios
        .get<string[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllFathersRoutesByPermisoId/${permisoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllFathersWithRoutes(permisoId: number): Promise<RutasConPadresDTO[]> {
    return new Promise<RutasConPadresDTO[]>((resolve, reject) => {
      axios
        .get<RutasConPadresDTO[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllFathersWithRoutes/${permisoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
