import { GenericService } from "./generic.service";
import { IBaseEntity } from "../models/IBaseEntity";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import axios from "axios";

export interface IScrapPlacas extends IBaseEntity {
  origen: string;
  causa: string;
  reparadorId: number;
  componente: string;
  modelo: string;
  familia: string;
  trazaOperaciones2Id: number;
  operacion?: TrazaOperaciones;
  numeroOp?: string;
  comentariosCalidad?: string;
  codigo: string;


}
export class ScrapPlacasService extends GenericService<IScrapPlacas> {
  Url = "ScrapPlacas";
  constructor() {
    super("ScrapPlacas");
  }
  GetListByDesdeHasta({ fechaDesde, fechaHasta }): Promise<IScrapPlacas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IScrapPlacas[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByDesdeHasta/${fechaDesde}/${fechaHasta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetOpsByFamilia(familia: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<string[]>(
          `${process.env.REACT_APP_API_URL}/ScrapPlacas/GetOpsByFamilia/${familia}`
        )
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

}


