/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { ITrazaUnit } from "app/models/ITrazaUnit";
import { ReporteRenacer } from "app/models/Stored Procdure/ReporteRenacer";
import { ReporteRenacerLpn } from "app/models/Stored Procdure/ReporteRenacerLpn";
import axios from "axios";
import { GenericService } from "./generic.service";
import { RenacerExcelOperaciones } from "app/features/trazabilidad/modules/cargaProduccionRenacer/RenacerPage";
import { TrazaOperacionesWithOpDTO } from "app/models/DTO/TrazaOperacionesWithOpDTO";
import { IBateasConCantidadDTO } from "app/features/produccion/modules/puestoTransferencia/models/IBateasConCantidadDTO";
import { IBateasDTO } from "app/features/produccion/modules/puestoTransferencia/models/IBateasDTO";
import { TrazaOperacionWithOpAndLoteDTO } from "app/models/DTO/TrazaOperacionWithOpAndLoteDTO";

export interface RenacerOperaciones {
  id: number;
  codigo: string;
  fecha: string;
  familia: string;
  alias: string;
  modelo: string;
  lpn: string;
  lineaProduccionId: number;
  puesto: string;
  fechaPuesto: string;
}
export class TrazaOperacionesService extends GenericService<TrazaOperaciones> {
  Url = "TrazaOperaciones2";
  constructor() {
    super("TrazaOperaciones2");
  }
  public getHistorialByCodigo(codigo): Promise<TrazaOperaciones> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetHistorialByCodigo/${codigo}/`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByCodigo(codigo): Promise<TrazaOperaciones> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigo/${codigo}/`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getOperacionRechazo(codigo): Promise<TrazaOperaciones> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetOperacionRechazo/${codigo}/`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetHistorialByOperacionId(operacion: number): Promise<TrazaOperaciones> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetHistorialByOperacionId/${operacion}/`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetPiezasByOperacion(operacionId: number): Promise<ITrazaUnit[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaUnit[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPiezasByOperacion/${operacionId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListByLineaPuestoAndFechaAndHora({
    lineaPuestoId,
    fecha,
    horaDesde,
    horaHasta
  }): Promise<TrazaOperaciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetListByLineaPuestoAndFechaAndHora/${lineaPuestoId}/${fecha}/${horaDesde}/${horaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByDateAndIden(fecha: string): Promise<TrazaOperaciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByDateAndIden/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetCantidadByLineaPuesto({ lineaPuestoId, fecha, horaDesde, horaHasta, familia, modelo }): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetCantidadByLineaPuesto/${lineaPuestoId}/${fecha}/${horaDesde}/${horaHasta}/${familia}/${modelo}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllByIden(): Promise<TrazaOperaciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByIden`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByFechaAndHours(fecha: string, hours: string): Promise<TrazaOperaciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByFechaAndHours/${fecha}/${hours}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetTotalRechazosByFamilia({ fecha, familia, lineaId, hours }): Promise<TrazaOperaciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetTotalRechazosByFamilia/${fecha}/${familia}/${lineaId}/${hours}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public DesvincularOperacionByCodigo(codigo: string): Promise<TrazaOperaciones> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones>(`${import.meta.env.VITE_API_URL}/${this.Url}/DesvincularOperacionByCodigo/${codigo}/`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public CambioCajaElectrica(piezaAnterior: string, piezaNueva: string): Promise<TrazaOperaciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/CambioCajaElectrica/${piezaAnterior}/${piezaNueva}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetReporteRenacerByLpn({ lpn }): Promise<ReporteRenacer[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ReporteRenacer[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetReporteRenacerByLpn/${lpn}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetReporteTotalRenacer(): Promise<ReporteRenacerLpn[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ReporteRenacerLpn[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetReporteTotalRenacer`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetRenacerOperacionesByLpn(lpn: string): Promise<RenacerOperaciones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<RenacerOperaciones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetRenacerOperacionesByLpn/${lpn}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public ImportarRenacer(renacerOperaciones: RenacerExcelOperaciones[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/ImportarRenacer`, renacerOperaciones)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async GetAllTracesByPuntDTO(codigoBatea: string): Promise<TrazaOperacionesWithOpDTO[]> {
    return new Promise<TrazaOperacionesWithOpDTO[]>((resolve, reject) => {
      axios
        .get<TrazaOperacionesWithOpDTO[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTracesByPuntDTO/${codigoBatea}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTracesByPunt(codigoBatea: string): Promise<TrazaOperaciones[]> {
    return new Promise<TrazaOperaciones[]>((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTracesByPunt/${codigoBatea}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllPuntIntoContainerById(containerId: number): Promise<IBateasDTO[]> {
    return new Promise<IBateasDTO[]>((resolve, reject) => {
      axios
        .get<IBateasDTO[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPuntIntoContainerById/${containerId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllCountTracesByContainerId(containerId: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllCountTracesByContainerId/${containerId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllPuntWithCountOfPlates(sectorId: number, puesto: string): Promise<IBateasConCantidadDTO[]> {
    return new Promise<IBateasConCantidadDTO[]>((resolve, reject) => {
      axios
        .get<IBateasConCantidadDTO[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPuntWithCountOfPlates/${sectorId}/${puesto}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetByCodigoAllDatesOfTrace(codigo: string): Promise<TrazaOperaciones> {
    return new Promise<TrazaOperaciones>((resolve, reject) => {
      axios
        .get<TrazaOperaciones>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigoAllDatesOfTrace/${codigo}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllDatesOfTraces(listaTrazas: string[]): Promise<TrazaOperaciones[]> {
    return new Promise<TrazaOperaciones[]>((resolve, reject) => {
      axios
        .post<TrazaOperaciones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllDatesOfTraces`, listaTrazas)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetDatesOfPlateWithTrace(codigo: string): Promise<TrazaOperacionWithOpAndLoteDTO> {
    return new Promise<TrazaOperacionWithOpAndLoteDTO>((resolve, reject) => {
      axios
        .get<TrazaOperacionWithOpAndLoteDTO>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetDatesOfPlateWithTrace/${codigo}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetTrazaAutomotriz(tipoBusqueda: number, codigo: string): Promise<TrazaOperaciones[]> {
    return new Promise<TrazaOperaciones[]>((resolve, reject) => {
      axios
        .get<TrazaOperaciones[]>(
          `${process.env.REACT_APP_API_URL}/${this.Url}/GetTrazaAutomotriz/${tipoBusqueda}/${codigo}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
