import { IContPedido } from "app/models/IContPedido";
import { GenericService } from "./generic.service";
import axios from "axios";

export class ContPedidoService extends GenericService<IContPedido> {
  Url = "ContPedido";
  constructor() {
    super("ContPedido");
  }
  public GetListByFechaProgramado(fechaProgramado: string): Promise<IContPedido[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContPedido[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByFechaProgramado/${fechaProgramado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByFechaHastaProgramado(fechaProgramado: string): Promise<IContPedido[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContPedido[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByFechaHastaProgramado/${fechaProgramado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByContContenedorId(contContenedorId: number): Promise<IContPedido[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContPedido[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByContContenedorId/${contContenedorId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByMesEstadoProgramado(fecha: string): Promise<IContPedido[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContPedido[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByMesEstadoProgramado/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByMesEstadoEntregado(fecha: string): Promise<IContPedido[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContPedido[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByMesEstadoEntregado/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
