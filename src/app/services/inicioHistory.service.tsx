import axios from "axios";
import { IInicioHistory } from "app/models/IInicioHistory";
import { GenericService } from "./generic.service";

export class InicioHistoryService extends GenericService<IInicioHistory> {
  Url = "InicioHistory";
  constructor() {
    super("InicioHistory");
  }
  public getAllByNroSerie(codigo: string): Promise<IInicioHistory[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicioHistory[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByNroSerie/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByFechaAndLineaId(
    fechaDesde: string,
    fechaHasta: string,
    codReparacion: string
  ): Promise<IInicioHistory[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicioHistory[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFechaAndLineaId/${fechaDesde}/${fechaHasta}/${codReparacion}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByFechaAndModelo(fechaDesde: string, fechaHasta: string, modelo: string): Promise<IInicioHistory[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicioHistory[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFechaAndModelo/${fechaDesde}/${fechaHasta}/${modelo}`
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
