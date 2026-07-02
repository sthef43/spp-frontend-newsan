import axios from "axios";
import { IImpresionEtiqueta } from "app/models/IImpresionEtiqueta";

interface PrinterDetails {
  name: string;
  isDefault: boolean;
  option: { [key: string]: string; };
}

export class ImpresionEtiquetaService {
  Url = "ImpresionEtiqueta";
  public getByOp(op: string): Promise<IImpresionEtiqueta[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IImpresionEtiqueta[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getByOP/${op}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllImpresionByDateOPAndOpcion(fechaDesde: string, fechaHasta: string, op: string, opcion: number): Promise<IImpresionEtiqueta[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IImpresionEtiqueta[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllImpresionByDateOPAndOpcion/${fechaDesde}/${fechaHasta}/${op}/${opcion}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllImpresionByDateLineaAndOpcion(fechaDesde: string, fechaHasta: string, lineaId: number, opcion: number): Promise<IImpresionEtiqueta[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IImpresionEtiqueta[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllImpresionByDateLineaAndOpcion/${fechaDesde}/${fechaHasta}/${lineaId}/${opcion}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByCodIntAndLineaId({ codInt, lineaId }): Promise<IImpresionEtiqueta> {
    return new Promise((resolve, reject) => {
      axios
        .get<IImpresionEtiqueta>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodIntAndLineaId/${codInt}/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public post(modelo: IImpresionEtiqueta): Promise<IImpresionEtiqueta> {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/post`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public put(modelo: IImpresionEtiqueta): Promise<IImpresionEtiqueta> {
    return new Promise((resolve, reject) => {
      axios
        .put(`${import.meta.env.VITE_API_URL}/${this.Url}/put`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/${this.Url}/delete/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public CheckServer(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>("http://localhost/check")
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(`No se pudo conectar con el servicio: ${error}`)
        })
    })
  }
  public GetListaImpresoras(): Promise<PrinterDetails[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<PrinterDetails[]>(`http://localhost/lista_impresoras`)
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
  public Imprimir(impresora: string, zpl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .post(`http://localhost/imprimir`, { impresora, zpl })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
  // --- RFID ---
  public postRFID(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_API_URL}/ImpresionEtiquetaRFID/post`, payload)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  public getRFIDByCodigoInterno(codigoInterno: string): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/ImpresionEtiquetaRFID/GetByCodigoInterno/${codigoInterno}`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  // para el delete doble
  public deleteWithRFID(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/${this.Url}/DeleteWithRFID/${id}`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
}
