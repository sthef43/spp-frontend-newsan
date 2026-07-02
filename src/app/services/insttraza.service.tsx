/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "axios";
import { IInsttraza } from "app/models/IInsttraza";

export class InsttrazaService {
  Url = "Insttraza";
  public getReporteRequest({ identificadorLinea, turno, fechaDesde, fechaHasta }): Promise<IInsttraza[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInsttraza[]>(
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
}
