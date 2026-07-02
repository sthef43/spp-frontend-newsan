import { IFamilies } from "app/models/mes/IFamilies";
import axios from "axios";
import { GenericMesService } from "./genericMes.service";

export class FamiliesService extends GenericMesService<IFamilies> {
  Url = "Families";
  constructor() {
    super("Families");
  }
  async getbyproductoLinea(producto: number): Promise<IFamilies[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IFamilies[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getByProductoLinea/${producto}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
