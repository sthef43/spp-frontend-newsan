import axios from "axios";
import { IZPL_Impresiones } from "app/models/IZPL_Impresiones";

export class ZPL_ImpresionesService {
  Url = "ZPL_Impresiones";
  public getAllRequest(): Promise<IZPL_Impresiones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Impresiones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByTipoEtiquetaAndFamiliaId({ tipoEtiqueta, productoId }): Promise<IZPL_Impresiones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Impresiones[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTipoEtiquetaAndFamiliaId/${tipoEtiqueta}/${productoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByYear({ tipoEtiqueta, familiaId, year }): Promise<IZPL_Impresiones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Impresiones[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByYear/${tipoEtiqueta}/${familiaId}/${year}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByMonthAndYear({ tipoEtiqueta, familiaId, month, year }): Promise<IZPL_Impresiones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Impresiones[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByMonthAndYear/${tipoEtiqueta}/${familiaId}/${month}/${year}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IZPL_Impresiones): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IZPL_Impresiones): Promise<IZPL_Impresiones> {
    return new Promise((resolve, reject) => {
      axios
        .post<IZPL_Impresiones>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByTipoEtiqueta(tipoEtiquetaId: number): Promise<IZPL_Impresiones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Impresiones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByTipoEtiqueta/${tipoEtiquetaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByTipoEtiquetaAndFamiliaAndPrefijo({ tipoEtiqueta, familiaId, prefijo }): Promise<IZPL_Impresiones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Impresiones[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTipoEtiquetaAndFamiliaAndPrefijo/${tipoEtiqueta}/${familiaId}/${prefijo}`
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
