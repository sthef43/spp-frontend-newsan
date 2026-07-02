import { IDobComentario } from "app/models/IDobComentario";
import axios from "axios";
import { GenericService } from "./generic.service";

export class DobComentarioService extends GenericService<IDobComentario> {
  Url = "DobComentario";
  constructor() {
    super("DobComentario");
  }

  GetListByDobPlanoId(dobPlanoId: number): Promise<IDobComentario[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobComentario[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByDobPlanoId/${dobPlanoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
