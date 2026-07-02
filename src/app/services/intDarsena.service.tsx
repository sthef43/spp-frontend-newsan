import { IIntDarsena } from "app/models/IIntDarsena";
import { GenericService } from "./generic.service";
import axios from "axios";

export class IntDarsenaService extends GenericService<IIntDarsena> {
  Url = "IntDarsena";
  constructor() {
    super("IntDarsena");
  }
  public GetAllByPlant(plantId: number): Promise<IIntDarsena[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIntDarsena[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByPlant/${plantId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
