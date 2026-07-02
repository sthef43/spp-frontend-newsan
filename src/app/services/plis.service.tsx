import { IPlis } from "app/models/IPlis";
import axios from "axios";

export class PlisService {
  url = "Plis";

  public GetListByBarcode({ barcode }): Promise<IPlis[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlis[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByBarcode/${barcode}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
