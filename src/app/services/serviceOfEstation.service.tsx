import { IServiceOfEstation } from "app/models/IServiceOfEstation";
import axios from "axios";
import { GenericService } from "./generic.service";

export class ServiceOfEstationService extends GenericService<IServiceOfEstation> {
  Url = "ServiceOfEstation";
  constructor() {
    super("ServiceOfEstation");
  }
  public getInformationByNumber(model: string): Promise<IServiceOfEstation> {
    return new Promise((resolve, reject) => {
      axios
        .get<IServiceOfEstation>(`http://arushap34/iaserver/public/api/planta6/${model}/estacion1`, {
          transformRequest: (data, headers) => {
            delete headers.common["Authorization"];
            return data;
          }
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
