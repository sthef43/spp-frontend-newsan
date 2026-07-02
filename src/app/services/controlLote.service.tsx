import axios from "axios";
import { IControlLote } from "app/models/IControlLote";
import { ReprocesosAprobadosRechazadosDTO } from "app/models/DTO/ReprocesosAbradosRechazadosDTO";

export class ControlLoteService {
  Url = "ControlLote";
  public getAllRechazosRequest(modelA: string, modelB: string): Promise<IControlLote[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IControlLote[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRechazos/${modelA}/${modelB}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getControlLoteByIdRequest(model: number): Promise<IControlLote> {
    return new Promise((resolve, reject) => {
      axios
        .get<IControlLote>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetControlLoteById/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllRechazosByEstadoTemporadaRequest(modelA: number, modelB: number): Promise<IControlLote[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IControlLote[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByEstadoTemporada/${modelA}/${modelB}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByLineaId(lineaId: number): Promise<IControlLote[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IControlLote[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllRequest(): Promise<IControlLote[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IControlLote[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllTemporadasRequest(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<number[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTemporadas`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IControlLote): Promise<IControlLote> {
    return new Promise((resolve, reject) => {
      axios
        .post<IControlLote>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IControlLote): Promise<boolean> {
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
  public deleteRequest(Id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}?Id=${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public async GetAllByLineaIdAndStateReprocesingIsS(lineaId: number): Promise<IControlLote[]> {
    return new Promise<IControlLote[]>((resolve, reject) => {
      axios
        .get<IControlLote[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaIdAndStateReprocesingIsS/${lineaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public async ReproessingApprovedAndRejected(lineaId: number): Promise<ReprocesosAprobadosRechazadosDTO> {
    return new Promise<ReprocesosAprobadosRechazadosDTO>((resolve, reject) => {
      axios
        .get<ReprocesosAprobadosRechazadosDTO>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/ReproessingApprovedAndRejected/${lineaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
