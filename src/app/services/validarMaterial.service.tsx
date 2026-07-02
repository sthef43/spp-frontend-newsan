import { IValidarMaterial } from "app/models/IValidarMaterial";
import axios from "axios";
import { GenericService } from "./generic.service";

export class ValidarMaterialService extends GenericService<IValidarMaterial> {
  Url = "ValidarMaterial";
  constructor() {
    super("ValidarMaterial");
  }
  public getAllByFamiliaId(familiaId: number): Promise<IValidarMaterial[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IValidarMaterial[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFamiliaId/${familiaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
