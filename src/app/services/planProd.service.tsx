import axios from "axios";
import { IPlanProd } from "app/models/IPlanProd";
import { IModelos } from "app/models";
import { ReporteProduccionExcelDTO } from "app/models/DTO/ReporteProduccionExcelDTO";

export interface OPsDetalles {
  nroOP: string;
  modelo: string;
  producido: number;
  cantidad: number;
}
export class PlanProdService {
  Url = "PlanProd";
  public getByIdRequest(model: number): Promise<IPlanProd> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd>(`${import.meta.env.VITE_API_URL}/${this.Url}/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getPlanprodByNumeroOpRequest(model: string): Promise<IPlanProd> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPlanprodByNumeroOp/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListModelsByIdentifyLine({ identificador, lineaId }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListModelsByIdentifyLine/${identificador}/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getModelosByIdLinea(model: number): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetModelosByIdLinea/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByTipoUnidad(tipoUnidad: string): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByTipoUnidad/${tipoUnidad}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetPlanProdByIdLinea(model: number): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPlanProdByIdLinea/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getSemielaboradoValidacion(tipoSemi: number, lineaId: number): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetSemielaboradoValidacion/${tipoSemi}/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getPlanByLineaModeloUnidad({ idLinea, modelo, tipoUnidad }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/getPlanByLineaModeloUnidad/${idLinea}/${modelo}/${tipoUnidad}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getPlanByLineaModelo({ idLinea, modelo }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getPlanByLineaModelo/${idLinea}/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getPlanByIdLineaIdModelo({ idLinea, idModelo }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getPlanByIdLineaIdModelo/${idLinea}/${idModelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByLineaAndModeloAndSemielaborado({ idLinea, idModelo, tipoSemielaborado }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetListByLineaAndModeloAndTipoSemielaborado/${idLinea}/${idModelo}/${tipoSemielaborado}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByLoteCerradoRequest(loteCerrado: boolean): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLoteCerrado/${loteCerrado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllByLineaIdSinFiltroRequest(lineaId: number): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaIdSinFiltro/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByFechaRequest({ fechaDesde, fechaHasta, orgCode }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFecha/${fechaDesde}/${fechaHasta}/${orgCode}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByFechaAndPlantIdRequest({ fechaDesde, fechaHasta, plantId }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFechaAndPlantId/${fechaDesde}/${fechaHasta}/${plantId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  GetAllByFechaAndPlantId;
  public getAllByLineaFechaRequest({ fechaDesde, fechaHasta, idLinea }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFechaIdLinea/${fechaDesde}/${fechaHasta}/${idLinea}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByLineaModeloRequest({ idLinea, codigoModelo }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaModelo/${idLinea}/${codigoModelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getReporteRequest({ planProd, fechaDesde, fechaHasta }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReporte/${fechaDesde}/${fechaHasta}`,
          planProd
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getReportePorLineaRequest({ planProd, fechaDesde, fechaHasta }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReportePorLinea/${fechaDesde}/${fechaHasta}`,
          planProd
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getReportePorModeloRequest(modelo): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetReportePorModelo/`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IPlanProd): Promise<boolean> {
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
  public postRequest(entity: IPlanProd): Promise<IPlanProd> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPlanProd>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  DeleteRequest(Id: number): Promise<boolean> {
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
  public getAllByLoteCerradoNull(): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByLoteCerradoNull`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllModelos(): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllModelos`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getListByLineaIdRequest(lineaId: number): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllModelosByLineaId(lineaId: number): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllModelosByLineaId/${lineaId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch();
    });
  }

  public getAllModelosHistoricoByLineaId(lineaId: number): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllModelosHistoricoByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getListByGroupByModelosRequest(): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListByGroupByModelos`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetOpsByModelo(modelo: string, semielaborado: string): Promise<IPlanProd> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetOpsByModelo/${modelo}/${semielaborado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetOpsSemiElaborado(modelo: string, semielaboradoTipoId: number): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetOpsSemilaborados/${modelo}/${semielaboradoTipoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllLotesByModelo(modelo: string): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllLotesByModelo/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByLineaAndTipoPlaca({ idLinea, tipoPlaca }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByLineaAndTipoPlaca/${idLinea}/${tipoPlaca}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetOPsDelDia(identificadorLinea: number): Promise<OPsDetalles[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<OPsDetalles[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetOPSdelDia/${identificadorLinea}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllByLineaIdRequest(lineaId: number): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  // GetUtimasByLinea(int lineaId, string codigoNewsan2)
  public getUtimasByLinea({ lineaId, codigoNewsan2 }): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUtimasByLinea/${lineaId}/${codigoNewsan2}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  // GetUtimasByTipoSemi(string tipoSemi)
  public getUtimasByTipoSemi(tipoSemi): Promise<IPlanProd[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUtimasByTipoSemi/${tipoSemi}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async GetLastPlanProdByModeloWithRemanent(modelo: string, nombreLinea: string): Promise<IPlanProd> {
    return new Promise<IPlanProd>((resolve, reject) => {
      axios
        .get<IPlanProd>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetLastPlanProdByModeloWithRemanent/${modelo}/${nombreLinea}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllReportByRangeDateRequest(fecha: string, plantId: number): Promise<ReporteProduccionExcelDTO[]> {
    return new Promise<ReporteProduccionExcelDTO[]>((resolve, reject) => {
      axios
        .get<ReporteProduccionExcelDTO[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllReportByRangeDateRequest/${fecha}/${plantId}`
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
