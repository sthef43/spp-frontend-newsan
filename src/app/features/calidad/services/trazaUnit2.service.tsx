import axios from "axios";
import { ITrazaUnit } from "app/models/ITrazaUnit";
import { IEMPQDeclarations } from "app/models/IEMPQDeclarations";
import { ReporteProduccionAutomotriz } from "app/models/Stored Procdure/ReporteProduccionAutomotriz";
import { GenericService } from "app/services/generic.service";

export class TrazaUnit2Service extends GenericService<ITrazaUnit> {
  Url = "TrazaUnit2";
  constructor() {
    super("ITrazaUnit2");
  }

  public getByCodigo(codigo: string): Promise<ITrazaUnit> {
    const bodyFormData = new FormData();
    bodyFormData.append("codigo", codigo);
    return new Promise((resolve, reject) => {
      axios
        .post<ITrazaUnit>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigo`, bodyFormData)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllByCodigo(entities: IEMPQDeclarations[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCodigo`, entities)
        .then((response) => {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async GetAllPlatesRejected(): Promise<ITrazaUnit[]> {
    return new Promise<ITrazaUnit[]>((resolve, reject) => {
      axios
        .get<ITrazaUnit[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPlatesRejected`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DischargeAllPlates(entidades: ITrazaUnit[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/DischargeAllPlates`, entidades)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllPLatesRejectedByDates(fechaDesde: string, fechaHasta: string): Promise<ITrazaUnit[]> {
    return new Promise<ITrazaUnit[]>((resolve, reject) => {
      axios
        .get<ITrazaUnit[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPLatesRejectedByDates/${fechaDesde}/${fechaHasta}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetReportProductionByPosition(): Promise<ReporteProduccionAutomotriz[]> {
    return new Promise<ReporteProduccionAutomotriz[]>((resolve, reject) => {
      axios
        .get<ReporteProduccionAutomotriz[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReportProductionByPosition/`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public ActualizarRequest({ codigo, rechazado }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/ActualizarRequest/${codigo}/${rechazado}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
}
