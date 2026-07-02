import axios from "axios";
import { GenericService } from "./generic.service";
import { IContContenedor } from "app/models/IContContenedor";

export class ContContenedorService extends GenericService<IContContenedor> {
  Url = "ContContenedor";
  constructor() {
    super("ContContenedor");
  }
  public GetListByEmbarqueId(embarqueId: number): Promise<IContContenedor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContContenedor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByEmbarqueId/${embarqueId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByFechaProgramado(fechaProgramado: string): Promise<IContContenedor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContContenedor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByFechaProgramado/${fechaProgramado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByFechaHastaProgramado(fechaProgramado: string): Promise<IContContenedor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContContenedor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByFechaHastaProgramado/${fechaProgramado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByMesEstadoProgramado(fecha: string): Promise<IContContenedor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContContenedor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByMesEstadoProgramado/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByMesEstadoEntregado(fecha: string): Promise<IContContenedor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContContenedor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByMesEstadoEntregado/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByPlanProduccionAbierto(fecha: string): Promise<IContContenedor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContContenedor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlanProduccionAbierto/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
