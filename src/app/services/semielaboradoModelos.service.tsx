import { ISemielaboradoModelos } from "app/models/ISemielaboradoModelos";
import axios from "axios";
import { GenericService } from "./generic.service";

export class SemielaboradoModelosService extends GenericService<ISemielaboradoModelos> {
  Url = "SemielaboradoModelos";
  constructor() {
    super("SemielaboradoModelos");
  }
  getAllBySemiId(semiId: number): Promise<ISemielaboradoModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaboradoModelos[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllBySemiId/${semiId}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetByModeloAndSemielaboradoTipoId({ modeloId, semielaboradoTipoId }): Promise<ISemielaboradoModelos> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaboradoModelos>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetByModeloAndSemielaboradoTipoId/${modeloId}/${semielaboradoTipoId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
