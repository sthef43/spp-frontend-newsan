import { IEtiquetasIndicadoresCaja } from "app/models/IEtiquetasIndicadoresCaja";
import axios from "axios";
import { GenericService } from "./generic.service";

export class EtiquetasIndicadoresCajaService extends GenericService<IEtiquetasIndicadoresCaja> {
  Url = "ZPL_EtiquetasIndicadoresCaja";
  constructor() {
    super("ZPL_EtiquetasIndicadoresCaja");
  }
  public getAllByTipoM(tipoM: string): Promise<IEtiquetasIndicadoresCaja[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEtiquetasIndicadoresCaja[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTipoM/${tipoM}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
