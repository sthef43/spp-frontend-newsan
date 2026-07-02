import { IContPlanProduccion } from "app/models/IContPlanProduccion";
import { GenericService } from "./generic.service";
import axios from "axios";

export class ContPlanProduccionService extends GenericService<IContPlanProduccion> {
  Url = "ContPlanProduccion";
  constructor() {
    super("ContPlanProduccion");
  }
  public GetListByPlantaLineaId({ contPlantaId, linea }): Promise<IContPlanProduccion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContPlanProduccion[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlantaLineaId/${contPlantaId}/${linea}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByPlantaId(contPlantaId: number): Promise<IContPlanProduccion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContPlanProduccion[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlantaId/${contPlantaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
