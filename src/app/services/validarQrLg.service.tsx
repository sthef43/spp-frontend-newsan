import { IValidarQrLg } from "app/models/IValidarQrLg";
import { GenericService } from "./generic.service";
import axios from "axios";

export class ValidarQrLgService extends GenericService<IValidarQrLg> {
  Url = "ValidarQrLg";
  constructor() {
    super("ValidarQrLg");
  }
  public GetListByPlantaLineaProducto({ plantaId, lineaId, productoId }): Promise<IValidarQrLg[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IValidarQrLg[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlantaLineaProducto/${plantaId}/${lineaId}/${productoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByPLPFecha({ plantaId, lineaId, productoId, fechaDesde, fechaHasta }): Promise<IValidarQrLg[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IValidarQrLg[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPLPFecha/${plantaId}/${lineaId}/${productoId}/${fechaDesde}/${fechaHasta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByCodigo(codigo: string): Promise<IValidarQrLg[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IValidarQrLg[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByCodigo/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByPLPMC({ plantaId, lineaId, productoId, modeloId, codigo }): Promise<IValidarQrLg[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IValidarQrLg[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPLPMC/${plantaId}/${lineaId}/${productoId}/${modeloId}/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
