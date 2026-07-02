import { ISemielaborado } from "app/models/ISemielaborado";
import axios from "axios";
import { GenericService } from "./generic.service";

export class SemielaboradoService extends GenericService<ISemielaborado> {
  Url = "Semielaborado";
  constructor() {
    super("Semielaborado");
  }
  public getAllByLineaId(lineaId: number): Promise<ISemielaborado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaborado[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByLineaId/${lineaId}`)
        .then((reponse) => {
          resolve(reponse.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
