import { IDobImpresionesPlanos } from "app/models/IDobImpresionesPlanos";
import axios from "axios";
import { GenericService } from "./generic.service";

export class DobImpresionesPlanosService extends GenericService<IDobImpresionesPlanos> {
  Url = "DobImpresionesPlanos";
  constructor() {
    super("DobImpresionesPlanos");
  }
  public getByDobPlano(dobPlanoId: number): Promise<IDobImpresionesPlanos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobImpresionesPlanos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getByDobPlano/${dobPlanoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
