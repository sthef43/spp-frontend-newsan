import { ILine } from "app/models/ILine";
import { GenericService } from "./generic.service";
import axios from "axios";

export class LineService extends GenericService<ILine> {
  Url = "Line";
  constructor() {
    super("Line");
  }
  public getAllUnrelated(): Promise<ILine[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILine[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllUnrelated`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByPlantaId(plantaId: number): Promise<ILine[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILine[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlantaId/${plantaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
