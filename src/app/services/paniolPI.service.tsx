import { IPaniolPI } from "app/models/IPaniolPI";
import axios from "axios";
import { GenericService } from "./generic.service";

export class PaniolPIService extends GenericService<IPaniolPI> {
  Url = "PaniolPI";
  constructor() {
    super("PaniolPI");
  }
  public GetAllByPlantId(plantId: number): Promise<IPaniolPI[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPaniolPI[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPlantId/${plantId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public PutChangeMovimiento(id: number): Promise<IPaniolPI> {
    return new Promise((resolve, reject) => {
      axios
        .put<IPaniolPI>(`${import.meta.env.VITE_API_URL}/${this.Url}/PutChangeMovimiento/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public GetAllHistoryByArticulo(articulo: string): Promise<IPaniolPI[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPaniolPI[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllHistoryById/${articulo}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
