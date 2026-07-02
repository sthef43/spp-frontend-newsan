import axios from "axios";
import { ILineaSfcsplus } from "app/models/sfcsplus/ILineaSfcsplis";

export class LineaSfcsplusService {
  Url = "LineaSfcsplus";
  public GetListByPlantaId(plantaId: number): Promise<ILineaSfcsplus[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaSfcsplus[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByPlantaId/${plantaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
