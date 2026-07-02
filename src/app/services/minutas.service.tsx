import axios from "axios";
import { GenericService } from "./generic.service";
import { IMinutas } from "app/models/IMinutas";

export class MinutasService extends GenericService<IMinutas> {
  Url = "Minutas";
  constructor() {
    super("Minutas");
  }
  // GetAllByLF(int lineaId, DateTime fechaDesde, DateTime fechaHasta)
  public GetAllByLF({lineaId, fechaDesde, fechaHasta}): Promise<IMinutas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMinutas[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByLF/${lineaId}/${fechaDesde}/${fechaHasta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
