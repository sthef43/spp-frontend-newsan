import axios from "axios";
import { IPlantaSfcsplus } from "app/models/sfcsplus/IPlantaSfcsplis";

export class PlantaSfcsplusService {
  Url = "PlantaSfcsplus";
  public GetById(id: number): Promise<IPlantaSfcsplus> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlantaSfcsplus>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetById/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByNombre(nombre: string): Promise<IPlantaSfcsplus> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlantaSfcsplus>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByNombre/${nombre}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
