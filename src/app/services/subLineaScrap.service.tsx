import axios from "axios";
import { GenericService } from "./generic.service";
import { ISubLineaScrap } from "app/models/ISubLineaScrap";

export class SubLineaScrapService extends GenericService<ISubLineaScrap> {
  Url = "SubLineaScrap";
  constructor() {
    super("SubLineaScrap");
  }
  public getAllOfDay = (): Promise<ISubLineaScrap[]> => {
    return new Promise((resolve, reject) => {
      return axios
        .get<ISubLineaScrap[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllOfDay`)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
}
