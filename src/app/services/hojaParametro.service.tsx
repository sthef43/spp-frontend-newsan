import { IHojaParametro } from "app/models/IHojaParametro";
import { GenericService } from "./generic.service";
import axios from "axios";

export class HojaParametroService extends GenericService<IHojaParametro> {
  Url = "HojaParametro";
  constructor() {
    super("HojaParametro");
  }
  public GetListByEstado({ estado, productoId, familiaId }): Promise<IHojaParametro[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IHojaParametro[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByEstado/${estado}/${productoId}/${familiaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }  
  public GetListByModeloId(modelosId: number): Promise<IHojaParametro[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IHojaParametro[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByModeloId/${modelosId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}

