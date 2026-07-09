import axios from "axios";
import { GenericService } from "./generic.service";
import { IDotaHistorico } from "app/models/IDotaHistorico";

export class DotaHistoricoService extends GenericService<IDotaHistorico> {
  url = "DotaHistorico";
  constructor() {
    super("DotaHistorico");
  }

  public GetNumeroSiguienteByLineaAndFamilia({ lineaProduccionId, dotaFamiliaId }): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetNumeroSiguienteByLineaAndFamilia/${lineaProduccionId}/${dotaFamiliaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByLineaAndFamilia({ lineaProduccionId, dotaFamiliaId }): Promise<IDotaHistorico[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDotaHistorico[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetListByLineaAndFamilia/${lineaProduccionId}/${dotaFamiliaId}`
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
