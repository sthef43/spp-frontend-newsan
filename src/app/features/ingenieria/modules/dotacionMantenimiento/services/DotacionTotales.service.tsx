import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IDotacionTotales } from "../models/IDotacionTotales";

export class DotacionTotalesService extends GenericService<IDotacionTotales> {
  Url = "DotacionTotales";
  constructor() {
    super("DotacionTotales");
  }

  public async GetTotalsByDotacionId(dotacionId: number): Promise<IDotacionTotales> {
    return new Promise<IDotacionTotales>((resolve, reject) => {
      axios
        .get<IDotacionTotales>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetTotalsByDotacionId/${dotacionId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
