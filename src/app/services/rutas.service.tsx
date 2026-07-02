import { IRutas } from "app/models/IRutas";
import axios from "axios";
import { GenericService } from "./generic.service";

export class RutasService extends GenericService<IRutas> {
  Url = "Rutas";
  constructor() {
    super("Rutas");
  }
  public GetByLineaIdRequest(id: number): Promise<IRutas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRutas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLineaId/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
