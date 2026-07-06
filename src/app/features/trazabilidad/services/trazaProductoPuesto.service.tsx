import { ITrazaProductoPuesto } from "app/models/ITrazaProductoPuesto";
import axios from "axios";
import { GenericService } from "app/services/generic.service";

export class TrazaProductoPuestoService extends GenericService<ITrazaProductoPuesto> {
  Url = "TrazaProductoPuesto";

  public getProductoPuestoByProductoId(productoId: number): Promise<ITrazaProductoPuesto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaProductoPuesto[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/getProductoPuestoByProductoId/${productoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  constructor() {
    super("TrazaProductoPuesto");
  }
}
