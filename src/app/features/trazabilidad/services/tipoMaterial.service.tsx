import axios from "axios";
import { ITipoMaterial } from "app/models/ITipoMaterial";
import { GenericService } from "app/services/generic.service";

export class TipoMaterialService extends GenericService<ITipoMaterial> {
  Url = "TipoMaterial";
  constructor() {
    super("TipoMaterial");
  }
  public getAllByProductId(idProduct: number): Promise<ITipoMaterial[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITipoMaterial[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductId/${idProduct}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
