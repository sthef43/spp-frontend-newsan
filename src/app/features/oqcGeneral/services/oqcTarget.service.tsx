import { IOQCTarget } from "app/models/IOQCTarget";
import { GenericService } from "../../../services/generic.service";
import axios from "axios";

export class OQCTargetService extends GenericService<IOQCTarget> {
  Url = "OQCTarget";
  constructor() {
    super("OQCTarget");
  }
  public GetAllByProductoId(productoId: number): Promise<IOQCTarget[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCTarget[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductoId/${productoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByLineaId(lineaId: number): Promise<IOQCTarget> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCTarget>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByProductoId(productoId: number): Promise<IOQCTarget> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCTarget>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByProductoId/${productoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
