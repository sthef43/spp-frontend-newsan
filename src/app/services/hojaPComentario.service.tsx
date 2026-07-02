import { IHojaPComentario } from "app/models/IHojaPComentario";
import axios from "axios";
import { GenericService } from "./generic.service";

export class HojaPComentarioService extends GenericService<IHojaPComentario> {
  Url = "HojaPComentario";
  constructor() {
    super("HojaPComentario");
  }

  GetListByHojaParametroId(hojaParametroId: number): Promise<IHojaPComentario[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IHojaPComentario[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByHojaParametroId/${hojaParametroId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
