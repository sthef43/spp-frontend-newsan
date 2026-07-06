import { ITrazaManualHistory } from "app/models/ITrazaManualHistory";
import axios from "axios";
import { GenericService } from "./generic.service";

export class TrazaManualHistoryService extends GenericService<ITrazaManualHistory> {
  Url = "TrazaManualHistory";
  constructor() {
    super("TrazaManualHistory");
  }
  public getAllByNroSerie(codigo: string): Promise<ITrazaManualHistory[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaManualHistory[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByNroSerie/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
