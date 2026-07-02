import { ITRANS_OK_DET } from "app/models/ITRANS_OK_DET";
import axios from "axios";

export class TRANS_OK_DETService {
  Url = "TRANS_OK_DET";
  public GetAllRequest(): Promise<ITRANS_OK_DET[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITRANS_OK_DET[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
