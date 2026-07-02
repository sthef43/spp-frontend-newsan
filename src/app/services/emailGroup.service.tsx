import { IEmailGroup } from "app/models/IEmailGroup";
import { GenericService } from "./generic.service";
import axios from "axios";

export class EmailGroupService extends GenericService<IEmailGroup> {
  Url = "EmailGroup";
  constructor() {
    super("EmailGroup");
  }
  public GetAllByPlantId(plantId: number): Promise<IEmailGroup[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEmailGroup[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPlant/${plantId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
