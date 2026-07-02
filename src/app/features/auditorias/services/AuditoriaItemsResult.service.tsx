import { GenericService } from "app/services/generic.service";
import { IAuditoriaItemsResult } from "../models/IAuditoriaItemsResult";
import axios from "axios";

export class AuditoriaItemsResultService extends GenericService<IAuditoriaItemsResult> {
  Url = "AuditoriaItemsResult";
  constructor() {
    super("AuditoriaItemsResult");
  }

  public async MultiPutItemsResult(items: IAuditoriaItemsResult[]): Promise<IAuditoriaItemsResult[]> {
    return new Promise<IAuditoriaItemsResult[]>((resolve, reject) => {
      axios
        .put(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPutItemsResult/`, items)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
