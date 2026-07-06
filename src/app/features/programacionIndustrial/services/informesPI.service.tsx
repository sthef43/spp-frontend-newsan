import { IInformesPI } from "app/models/IInformesPI";
import axios from "axios";
import { GenericService } from "./generic.service";

export class InformesPIService extends GenericService<IInformesPI> {
  Url = "InformesPI";
  constructor() {
    super("InformesPI");
  }
  public getAllByPlantId({ plantId, fecha, turnoId }): Promise<IInformesPI[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInformesPI[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPlantId/${plantId}/${fecha}/${turnoId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
