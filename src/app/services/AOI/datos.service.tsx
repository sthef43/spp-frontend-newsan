import { IDatos } from "app/models/AOI/IDatos";
import { IDatos2 } from "app/models/AOI/IDatos2";
import axios from "axios";

interface objetoDatos {
  DatosPlacas: IDatos[];
  numerosStockers: string[];
}
const API_BASE_URL = "http://arushap41:81/api/SMTDataBase";

export class DatosService {
  Url = "Datos";

  public getByIdPrueba = (id: number): Promise<IDatos> => {
    return new Promise((resolve, reject) => {
      axios
        .get<IDatos>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByIdPrueba/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  };

  public getItemsByDate = (date: string): Promise<IDatos2[]> => {
    return new Promise((resolve, reject) => {
      axios
        .get<IDatos2[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetItemsByDate/${date}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  };
}
