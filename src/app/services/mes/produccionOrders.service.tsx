import { IProductionOrders } from "app/models/mes/IProductionOrders";
import axios from "axios";
import { GenericMesService } from "./genericMes.service";

export class ProductionOrdersService extends GenericMesService<IProductionOrders> {
  Url = "ProductionOrders";
  constructor() {
    super("ProductionOrders");
  }
  async getbyproduct(producto: number, planta: number): Promise<IProductionOrders> {
    return new Promise((resolve, reject) => {
      axios
        .get<IProductionOrders>(`${import.meta.env.VITE_API_URL}/${this.url}/getbyproduct/${producto}/${planta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
