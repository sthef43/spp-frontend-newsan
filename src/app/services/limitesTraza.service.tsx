/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ILimitesTraza } from "app/models";
import axios from "axios";
import { GenericService } from "./generic.service";

export class LimitesTrazaService extends GenericService<ILimitesTraza> {
  Url = "LimitesTraza";
  constructor() {
    super("LimitesTraza");
  }
  public getReporteRequest({ identificadorLinea, turno, fechaDesde, fechaHasta }): Promise<ILimitesTraza[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILimitesTraza[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReporteDiario/${identificadorLinea}/${turno}/${fechaDesde}/${fechaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByLimitesIdAndFecha({ limitesId, fecha }): Promise<ILimitesTraza[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILimitesTraza[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByLimitesIdAndFecha/${limitesId}/${fecha}`
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
