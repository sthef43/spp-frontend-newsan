import { TrazaUnit_History } from "app/models/ITrazaUnit_History";
import { GenericService } from "./generic.service";
import axios from "axios";
import { ITGroupResult } from "app/models/ITGroupResult";

export class TrazaUnit_History2Service extends GenericService<TrazaUnit_History> {
  Url = "TrazaUnit_History2";
  constructor() {
    super("TrazaUnit_History2");
  }

  public GetListByLineaPuestoAndFechaAndHora({
    lineaPuestoId,
    fecha,
    horaDesde,
    horaHasta
  }): Promise<TrazaUnit_History[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaUnit_History[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByLineaPuestoAndFechaAndHora/${lineaPuestoId}/${fecha}/${horaDesde}/${horaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListByLineaPuesto({ lineaPuestoId, fecha, horaDesde, horaHasta }): Promise<TrazaUnit_History[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaUnit_History[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByLineaPuesto/${lineaPuestoId}/${fecha}/${horaDesde}/${horaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListByLineaTurno({ lineaProduccionId, fecha, horaDesde, horaHasta }): Promise<ITGroupResult[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITGroupResult[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByLineaTurno/${lineaProduccionId}/${fecha}/${horaDesde}/${horaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListPuestosAndCantidad({ listLineaPuestoId, fecha, horaDesde, horaHasta }): Promise<TrazaUnit_History[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<TrazaUnit_History[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListPuestosAndCantidad`, {
          fecha: fecha,
          horaDesde: horaDesde,
          horaHasta: horaHasta,
          listLineaPuestoId: listLineaPuestoId
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListPuestosAndCantidadByFamilia({ listLineaPuestoId, fecha, horaDesde, horaHasta }): Promise<any[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<TrazaUnit_History[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListPuestosAndCantidadByFamilia`, {
          fecha: fecha,
          horaDesde: horaDesde,
          horaHasta: horaHasta,
          listLineaPuestoId: listLineaPuestoId
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetProduccidoTodayByLineaPuesto(lineaPuestoId): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetProduccidoTodayByLineaPuesto/${lineaPuestoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByFechaAndTurnoAndOthers({ fecha, idHora, puestoLineaId }): Promise<TrazaUnit_History[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<TrazaUnit_History[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFechaAndTurnoAndOthers/${fecha}/${idHora}/${puestoLineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getProduccidoPorFamiliaTodayByLineaPuesto(
    lineaPuestoId
  ): Promise<Array<{ familia: string; cantidad: number }>> {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<{ familia: string; cantidad: number }>>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetProduccidoPorFamiliaTodayByLineaPuesto/${lineaPuestoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetGNGPorFamiliaTodayByLineaPuesto(
    lineaPuestoId,
    lineaId,
    nombrePuesto
  ): Promise<Array<{ familia: string; cantidad: number }>> {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<{ familia: string; cantidad: number }>>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetGNGPorFamiliaTodayByLineaPuesto/${lineaPuestoId}/${lineaId}/${nombrePuesto}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetProduccionByModelo(
    lineaProduccionId: number,
    desde: number,
    hasta
  ): Promise<Array<{ lineaPuestoId: number; cantidad: number; familia: string; hora: number }>> {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<{ lineaPuestoId: number; cantidad: number; familia: string; hora: number }>>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetProduccionByModelo/${lineaProduccionId}/${desde}/${hasta}`
        )
        .then((r) => resolve(r.data))
        .catch((e) => reject(e));
    });
  }

  public GetProduccionAmountByDates(
    lineaProduccionId: number,
    fechaDesde: string,
    fechaHasta: string,
    desde: number,
    hasta
  ): Promise<Array<{ lineaPuestoId: number; cantidad: number; fecha: string }>> {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<{ lineaPuestoId: number; cantidad: number; fecha: string }>>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetProduccionAmountByDates/${lineaProduccionId}/${fechaDesde}/${fechaHasta}/${desde}/${hasta}`
        )
        .then((r) => resolve(r.data))
        .catch((e) => reject(e));
    });
  }

  public async GetAllRouteOfTraceWithId(trazaOperacionesId: number): Promise<TrazaUnit_History[]> {
    return new Promise<TrazaUnit_History[]>((resolve, reject) => {
      axios
        .get<TrazaUnit_History[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRouteOfTraceWithId/${trazaOperacionesId}`)
        .then((response) => { resolve(response.data) })
        .catch((error) => { reject(error) })
    })
  }
}
