import axios from "axios";
import { GenericService } from "app/services/generic.service";
import { ICLIImpresionEtiquetas } from "../Models/ICLIImpresionEtiquetas";

export class CLIImpresionEtiquetasService extends GenericService<ICLIImpresionEtiquetas> {
  Url = "CLIImpresionEtiquetas";
  constructor() {
    super("CLIImpresionEtiquetas");
  }

  GetItemByLPN(lpn: string): Promise<ICLIImpresionEtiquetas> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIImpresionEtiquetas>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetItemByLPN/${lpn}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  GetByLocalizadorId(id: number): Promise<ICLIImpresionEtiquetas> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIImpresionEtiquetas>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLocalizadorId/${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
