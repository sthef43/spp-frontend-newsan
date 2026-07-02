import { ILineaPuestoTablero } from "app/models/ILineaPuestoTablero";
import { GenericService } from "./generic.service";
import axios from "axios";

export class LineaPuestoTableroService extends GenericService<ILineaPuestoTablero> {
  Url = "LineaPuestoTablero";
  constructor() {
    super("LineaPuestoTablero");
  }
  public getByLineaPuestoId(id: number): Promise<ILineaPuestoTablero> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaPuestoTablero>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLineaPuestoId/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
