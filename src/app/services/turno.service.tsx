import { ITurno } from "app/models/ITurno";
import { GenericService } from "./generic.service";
import axios from "axios";

export class TurnoService extends GenericService<ITurno> {
  Url = "Turno";
  constructor() {
    super("Turno");
  }
  public getAllWR(): Promise<ITurno[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITurno[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWR`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
