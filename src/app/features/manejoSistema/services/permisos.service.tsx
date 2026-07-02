import { IPermisos } from "app/models/IPermisos";
import axios from "axios";
import { GenericService } from "../../../services/generic.service";

export class PermisosService extends GenericService<IPermisos> {
  Url = "Permisos";
  constructor() {
    super("Permisos");
  }
  getByRolId(id: number): Promise<IPermisos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPermisos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByRol/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
