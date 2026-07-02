import { IIntRemito } from "app/models/IIntRemito";
import { GenericService } from "./generic.service";
import axios from "axios";

export class IntRemitoService extends GenericService<IIntRemito> {
  Url = "IntRemito";
  constructor() {
    super("IntRemito");
  }
  public GetAllByFechaUserId({ fechaDesde, fechaHasta, userId }): Promise<IIntRemito[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIntRemito[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetAllByFechaUserId/${fechaDesde}/${fechaHasta}/${userId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  } 
  public GetAllByIntRemitoPadre(intRemitoPadre: number): Promise<IIntRemito[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIntRemito[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByIntRemitoPadre/${intRemitoPadre}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByIdRemito(idRemito: number): Promise<IIntRemito> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIntRemito>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByIdRemito/${idRemito}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
