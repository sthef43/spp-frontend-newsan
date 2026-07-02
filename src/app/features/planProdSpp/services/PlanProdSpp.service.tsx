import { IPlanProd } from "app/models";
import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ActualizarPlanProdSppDTO } from "../models/DTOS/ActualizarPlanProdSppDTO";
import { AyudaPlanificacion } from "../models/DTOS/AyudaPlanificacionDTO";
import { CambiarPosicionDTO } from "../models/DTOS/CambiarPosicionDTO";
import { IGeneratePlanProd } from "../models/DTOS/IGeneratePlanProd";
import { IPlanProdSpp } from "../models/IPlanProdSpp";

export class PlanProdSppService extends GenericService<IPlanProdSpp> {
  Url = "PlanProdSpp";
  constructor() {
    super("PlanProdSpp");
  }

  public async GetAllPlanByLineProduccionId(lineaProduccionId: number): Promise<IPlanProdSpp[]> {
    return new Promise<IPlanProdSpp[]>((resolve, reject) => {
      axios
        .get<IPlanProdSpp[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPlanByLineProduccionId/${lineaProduccionId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetPlanByShipmentIncludes(planProdId: number): Promise<IPlanProdSpp> {
    return new Promise<IPlanProdSpp>((resolve, reject) => {
      axios
        .get<IPlanProdSpp>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPlanByShipmentIncludes/${planProdId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllPlanByMonthAndLineProduccionId(
    lineaProduccionId: number,
    mesInicio: string,
    mesFin: string
  ): Promise<IPlanProdSpp[]> {
    return new Promise<IPlanProdSpp[]>((resolve, reject) => {
      axios
        .get<IPlanProdSpp[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllPlanByMonthAndLineProduccionId/${lineaProduccionId}/${mesInicio}/${mesFin}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GenerateNewPlanProd(listaModelos: IGeneratePlanProd): Promise<IPlanProd[]> {
    return new Promise<IPlanProd[]>((resolve, reject) => {
      axios
        .post<IPlanProd[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GenerateNewPlanProd`, listaModelos)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async PutPlanProdSpp(entidad: ActualizarPlanProdSppDTO): Promise<IPlanProdSpp[]> {
    return new Promise<IPlanProdSpp[]>((resolve, reject) => {
      axios
        .post<IPlanProdSpp[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/PutPlanProdSpp`, entidad)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async SearchPosisitonsByNumbers(objeto: CambiarPosicionDTO): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchPosisitonsByNumbers`, objeto)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllPlansByNumberPosition(objeto: CambiarPosicionDTO): Promise<AyudaPlanificacion[]> {
    return new Promise<AyudaPlanificacion[]>((resolve, reject) => {
      axios
        .post<AyudaPlanificacion[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPlansByNumberPosition`, objeto)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async ChangePlanInProducing(entidad: IPlanProdSpp): Promise<IPlanProdSpp> {
    return new Promise<IPlanProdSpp>((resolve, reject) => {
      axios
        .post<IPlanProdSpp>(`${import.meta.env.VITE_API_URL}/${this.Url}/ChangePlanInProducing`, entidad)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async CancelPlanInProducing(planProd: IPlanProdSpp): Promise<IPlanProdSpp> {
    return new Promise<IPlanProdSpp>((resolve, reject) => {
      axios
        .post<IPlanProdSpp>(`${import.meta.env.VITE_API_URL}/${this.Url}/CancelPlanInProducing`, planProd)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
