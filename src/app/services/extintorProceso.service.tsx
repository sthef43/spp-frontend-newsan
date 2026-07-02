import axios from "axios";
import { GenericService } from "./generic.service";
import { IExtintorProceso } from "app/models/IExtintorProceso";

export class ExtintorProcesoService extends GenericService<IExtintorProceso> {
  Url = "ExtintorProceso";
  constructor() {
    super("ExtintorProceso");
  }
  public GetListByPlant(planta: number): Promise<IExtintorProceso[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IExtintorProceso[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlant/${planta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }  
}
