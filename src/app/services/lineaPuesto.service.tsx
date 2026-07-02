import { ILineaPuesto } from "app/models/ILineaPuesto";
import axios from "axios";
import { GenericService } from "./generic.service";

export class LineaPuestoService extends GenericService<ILineaPuesto> {
  Url = "LineaPuesto";
  constructor() {
    super("LineaPuesto");
  }
  public getAllWithRelations(productId: number): Promise<ILineaPuesto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaPuesto[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWithRelations/${productId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByLineaId(lineaId: number): Promise<ILineaPuesto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaPuesto[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllPuestoRechazoByLineaProduccion(lineaId: number): Promise<ILineaPuesto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaPuesto[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPuestoRechazoByLineaProduccion/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
