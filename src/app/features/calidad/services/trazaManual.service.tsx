import { ITrazaManual } from "app/models/ITrazaManual";
import { GenericService } from "app/services/generic.service";
import axios from "axios";

export class TrazaManualService extends GenericService<ITrazaManual> {
  Url = "TrazaManual";
  constructor() {
    super("TrazaManual");
  }
  public getAllByCodigo({ codigo, tipoDeCodigo }): Promise<ITrazaManual[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaManual[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCodigo/${codigo}/${tipoDeCodigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByNroSerie(codigo: string): Promise<ITrazaManual> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaManual>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByNroSerie/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByTraza(codigo: string): Promise<ITrazaManual> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaManual>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByTraza/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByDateAndLineaId(fechaDesde: string, fechaHasta: string, lineaId: number): Promise<ITrazaManual[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaManual[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByDateAndLineaId/${fechaDesde}/${fechaHasta}/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public deleteOldRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/DeleteOld/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
