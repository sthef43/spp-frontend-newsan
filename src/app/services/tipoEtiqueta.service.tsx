import axios from "axios";
import { ITipoEtiqueta } from "app/models/ITipoEtiqueta";

export class TipoEtiquetaService {
  Url = "TipoEtiqueta";
  public GetByIdLinea(idLinea: number): Promise<ITipoEtiqueta[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITipoEtiqueta[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getByIdLinea/${idLinea}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
