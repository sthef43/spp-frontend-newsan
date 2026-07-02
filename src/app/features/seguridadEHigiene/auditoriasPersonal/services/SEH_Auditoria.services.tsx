import { GenericService } from "app/services/generic.service";
import { SEH_Auditoria } from "../interfaces/SEH_Auditoria";
import axios from "axios";

export interface SP_SearchPersonal {
  personalId: number | string;
  nombre: string;
  apellido: string;
  empresa: string;
  linea: string;
  planta: string;
  area: string;
}

export class SEH_AuditoriaServices extends GenericService<SEH_Auditoria> {
  constructor() {
    super("SEHAuditoria");
  }

  GetAllByDate(planta: string, from: string, to: string): Promise<SEH_Auditoria[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<SEH_Auditoria[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByDate/${planta}/${from}/${to}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  SearchPersonal(search: number): Promise<SP_SearchPersonal> {
    return new Promise((resolve, reject) => {
      axios
        .get<SP_SearchPersonal>(`${import.meta.env.VITE_API_URL}/${this.url}/SearchPersonal/${search}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetHistorialByPersonalId(personalId: number): Promise<SEH_Auditoria[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<SEH_Auditoria[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetHistorialByPersonalId/${personalId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  NuevaAuditoria(entity: SEH_Auditoria): Promise<SEH_Auditoria> {
    return new Promise((resolve, reject) => {
      axios
        .post<SEH_Auditoria>(`${import.meta.env.VITE_API_URL}/${this.url}/NuevaAuditoria`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
