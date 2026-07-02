import { IEtiquetasIndicadoresModelo } from "app/models/IEtiquetasIndicadoresModelo";
import axios from "axios";
import { GenericService } from "./generic.service";

export class EtiquetasIndicadoresModeloService extends GenericService<IEtiquetasIndicadoresModelo> {
  Url = "ZPL_EtiquetasIndicadoresModelo";
  constructor() {
    super("ZPL_EtiquetasIndicadoresModelo");
  }
  public getAllByTipoM({ tipoM, tipoU }): Promise<IEtiquetasIndicadoresModelo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEtiquetasIndicadoresModelo[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTipoM/${tipoM}/${tipoU}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
