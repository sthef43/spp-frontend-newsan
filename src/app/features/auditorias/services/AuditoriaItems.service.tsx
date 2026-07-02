import { GenericService } from "app/services/generic.service";
import { IAuditoriaItems } from "../models/IAuditoriaItems";
import axios from "axios";

export class AuditoriaItemsService extends GenericService<IAuditoriaItems> {
  Url = "AuditoriaItems";
  constructor() {
    super("AuditoriaItems");
  }

  public async MultiPostReturnList(data: IAuditoriaItems[]): Promise<IAuditoriaItems[]> {
    return new Promise<IAuditoriaItems[]>((resolve, reject) => {
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
