import { IEMPQDeclarations } from "app/models/IEMPQDeclarations";
import axios from "axios";

export interface IEMPQ_Declarations {
  id: string;
  organization_code: string;
  nro_Op: string;
  codigo_Producto: string;
  cantidad: number;
  referencia_1: string;
  fecha_Insercion: string;
  modelo: string;
}
export class Empq_declarationsService {
  url = "EMPQ_Declarations";

  Add(modelo: IEMPQ_Declarations) {
    return new Promise((resolve, reject) => {
      axios
        .post<number>(`${import.meta.env.VITE_API_URL}/${this.url}`, modelo)
        .then(function (reponse) {
          resolve(reponse.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetByCodigo(codigo: string): Promise<IEMPQ_Declarations> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEMPQ_Declarations>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByCodigo/${codigo}`)
        .then(function (reponse) {
          resolve(reponse.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  getCountByOpRequest(op: string): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.url}/GetCountByOp/${op}`)
        .then(function (reponse) {
          resolve(reponse.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByOrgOpFechaTurno({ org, op, fecha, turno }): Promise<IEMPQDeclarations[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEMPQDeclarations[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetListByOrgOpFechaTurno/${org}/${op}/${fecha}/${turno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByOrgOp({ org, op }): Promise<IEMPQDeclarations[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEMPQDeclarations[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByOrgOp/${org}/${op}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByOrgFechaTurno({ org, fecha, turno }): Promise<IEMPQDeclarations[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEMPQDeclarations[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetListByOrgFechaTurno/${org}/${fecha}/${turno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListInformeMensual({ month, year, lineaId, turno }): Promise<any[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetListInformeMensual/${month}/${year}/${lineaId}/${turno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  } 
  public GetListByOrgFechaDesdeHasta({ org, fechaDesde, fechaHasta }): Promise<any[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetListByOrgFechaDesdeHasta/${org}/${fechaDesde}/${fechaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListOrgFecha({ org, fechaDesde, fechaHasta }): Promise<any[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetListOrgFecha/${org}/${fechaDesde}/${fechaHasta}`
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

