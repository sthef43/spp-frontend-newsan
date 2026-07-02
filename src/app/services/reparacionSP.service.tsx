import { ReparacionesByReparador } from "app/models/DTO/ReparacionesByReparadordto";
import { IReparacion } from "app/models/IReparacion";
import { IReparacionesGroupDefectoDTO } from "app/models/IReparacionesGroupDefectoDTO";
import { ISPReparacion } from "app/models/ISPReparacion";
import { ReportePorPlanta } from "app/models/Stored Procdure/ReportePorPlanta";
import axios from "axios";

export class ReparacionSPService {
  Url = "Reparacion";
  public GetReparacionesSP({ fechaDesde, fechaHasta, codigoError2, watchTurno }): Promise<ISPReparacion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISPReparacion[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReparacionesSP/${fechaDesde}/${fechaHasta}/${codigoError2}/${watchTurno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetReparacionesByFechaAndLinea({ fechaDesde, fechaHasta, codigoError2 }): Promise<IReparacion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReparacion[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReparacionesByFechaAndLinea/${fechaDesde}/${fechaHasta}/${codigoError2}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllReparacionesWithDates({ fechaDesde, fechaHasta }): Promise<ReportePorPlanta[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ReportePorPlanta[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllReparacionesWithDates/${fechaDesde}/${fechaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetReparacionesByFechaAndLineaAndOthers({
    fechaDesde,
    fechaHasta,
    codigoError2,
    turno,
    tipo
  }): Promise<IReparacion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReparacion[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReparacionesByFechaAndLineaAndOthers/${fechaDesde}/${fechaHasta}/${codigoError2}/${turno}/${tipo}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllCountByReparador({ fechaDesde, fechaHasta, codigoError2, turno, tipo }): Promise<ReparacionesByReparador[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ReparacionesByReparador[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllCountByReparador/${fechaDesde}/${fechaHasta}/${codigoError2}/${turno}/${tipo}`
        )
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  } 

  public GetListByCodigoTrazabilidad({ codigoTrazabilidad }): Promise<IReparacion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReparacion[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByCodigoTrazabilidad/${codigoTrazabilidad}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetInformeMensual(month: number, year: number, codigoInicio: number, turno: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetInformeMensual/${month}/${year}/${codigoInicio}/${turno}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  public GetCantReparacionesByFechaAndLineaHora(
    fecha: string,
    codigoError2: string,
    horaDesde: string,
    horaHasta: string
  ): Promise<IReparacionesGroupDefectoDTO[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReparacionesGroupDefectoDTO[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetCantReparacionesByFechaAndLineaHora/${fecha}/${codigoError2}/${horaDesde}/${horaHasta}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public async SearchTracesOfPlates(codigosPlacas: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      axios
        .post<string[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchTracesOfPlates`, codigosPlacas)
        .then((response) => { resolve(response.data) })
        .catch((error) => { reject(error) })
    })
  }
}
