import { IReparadores } from "app/models/IReparadores";
import axios from "axios";
import { GenericService } from "./generic.service";

export class ReparadoresService extends GenericService<IReparadores> {
  url = "Reparadores";
  constructor() {
    super("Reparadores");    
  }
  public GetListByPlantId(plantId: number): Promise<IReparadores[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReparadores[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlantId/${plantId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
