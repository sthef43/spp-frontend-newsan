import { GenericService } from "app/services/generic.service";
import { IAuditoriaValores } from "../models/IAuditoriaValores";
import axios from "axios";

export class AuditoriaValoresService extends GenericService<IAuditoriaValores> {
  Url = "AuditoriaValores";
  constructor() {
    super("AuditoriaValores");
  }

  public async MultiPostReturnList(data: IAuditoriaValores[]): Promise<IAuditoriaValores[]> {
    return new Promise<IAuditoriaValores[]>((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPostReturnList`, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
