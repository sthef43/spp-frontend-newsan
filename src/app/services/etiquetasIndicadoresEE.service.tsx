import { IEtiquetasIndicadoresEE } from "app/models/IEtiquetasIndicadoresEE";
import axios from "axios";
import { GenericService } from "./generic.service";

export class EtiquetasIndicadoresEEService extends GenericService<IEtiquetasIndicadoresEE> {
  Url = "ZPL_EtiquetasIndicadoresEE";
  constructor() {
    super("ZPL_EtiquetasIndicadoresEE");
  }
  public getAllByTipoM(tipoM: string): Promise<IEtiquetasIndicadoresEE[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEtiquetasIndicadoresEE[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTipoM/${tipoM}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
