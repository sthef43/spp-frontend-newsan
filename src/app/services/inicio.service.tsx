import axios from "axios";
import { IInicio } from "app/models/IInicio";
import { ISPDashboardGetPanelData } from "app/models/sfcsplus/ISPDashboardGetPanelData";

interface Resultado {
  EquiposConSerie: any[];
  EquiposSinSerie: string[];
}

export class InicioService {
  Url = "Inicio";
  public getAllIniciosRequest({ fecha, turno, codigoInicio }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllInicios/${fecha}/${turno}/${codigoInicio}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByFechaAndTurnoAndOthers({ fecha, turno, codigoInicio, idHora }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllByFechaAndTurnoAndOthers/${fecha}/${turno}/${codigoInicio}/${idHora}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByFechaAndLinea({ fecha, codigoNewsan }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByFechaAndLinea/${fecha}/${codigoNewsan}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByFechaAndNombreInicio({ fecha, nombreInicio }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByFechaAndNombreInicio/${fecha}/${nombreInicio}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByNombreInicio({ nombreInicio }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByNombreInicio/${nombreInicio}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllIniciosByFechaRequest({ fechaDesde, fechaHasta }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllIniciosDesdeHasta/${fechaDesde}/${fechaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllOpsDelDiaRequest({ fecha, turno, codigoInicio }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllOpsDelDia/${fecha}/${turno}/${codigoInicio}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getUltimoInicioByLineaRequest({ codigoLinea, fechaActual, modelo }): Promise<IInicio> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetUltimoInicioByLinea/${codigoLinea}/${fechaActual}/${modelo}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByModelo(modelo: string): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByModelo/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByLinea({ fecha, codLinea }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLinea/${fecha}/${codLinea}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IInicio): Promise<boolean> {
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
  public cambiarTrazaRequest(entity: IInicio, trazaVieja: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/CambiarTraza/${trazaVieja}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public deleted(entity: IInicio): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/Deleted`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IInicio): Promise<IInicio> {
    return new Promise((resolve, reject) => {
      axios
        .post<IInicio>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByCodigoNewsan(codigoNewsan: string): Promise<IInicio> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigoNewsan/${codigoNewsan}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByCodigoTrazabilidad(codigoTrazabilidad: string): Promise<IInicio> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigoTrazabilidad/${codigoTrazabilidad}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByCodigoTrazabilidadDisponible(codigoTrazabilidad: string): Promise<IInicio> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigoTrazabilidadDisponible/${codigoTrazabilidad}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllByNroOp(numeroOp: string): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByNroOp/${numeroOp}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllIniciosByFechaTurnoLinea({ fecha, turno, codigoNewsan2 }): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllIniciosByFechaTurnoLinea/${fecha}/${turno}/${codigoNewsan2}`
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

  public GetPendienteByOP(numeroOp: string): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPendientesByOP/${numeroOp}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetFamiliaByCN(cn: string): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .get<string>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetFamiliaByCN/${cn}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetModeloProducidoByCN(cn: string): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .get<string>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetModeloProducidoByCN/${cn}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetProducidosPorLinea(fecha: string): Promise<ISPDashboardGetPanelData[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISPDashboardGetPanelData[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetProducidosPorLinea/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListByNRO_OP(op: string): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByNRO_OP/${op}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public DeleteById(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/DeleteById/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListByModeloFin(modelo: string): Promise<IInicio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByModeloFin/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByDesdeHasta(modelo: string[]): Promise<Resultado> {
    return new Promise((resolve, reject) => {
      axios
        .post<Resultado>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByDesdeHasta/`,
          { codigosNewsan: modelo },
          { headers: { "Content-Type": "application/json" } }
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetLastTraza(idProduccion: number): Promise<IInicio> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInicio>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLastTraza/${idProduccion}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public async GetInicioEndedByCodigoNewsan(codigoNewsan: string): Promise<IInicio> {
    return new Promise<IInicio>((resolve, reject) => {
      axios
        .get<IInicio>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetInicioEndedByCodigoNewsan/${codigoNewsan}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
