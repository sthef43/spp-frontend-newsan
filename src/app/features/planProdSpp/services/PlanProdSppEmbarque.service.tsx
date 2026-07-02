import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { PlanProdEmbarquesSppListDTO } from "../models/DTOS/PlanProdEmbarquesSppListDTO";
import { PlanProdSppConEmbarquesDTO } from "../models/DTOS/PlanProdSppConEmbarquesDTO";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";

export class PlanProdSppEmbarqueService extends GenericService<IPlanProdSppEmbarque> {
  Url = "PlanProdSppEmbarque";
  constructor() {
    super("PlanProdSppEmbarque");
  }

  public async GetAllShipmentByMultisIds(multisId: number[]): Promise<PlanProdSppConEmbarquesDTO[]> {
    return new Promise<PlanProdSppConEmbarquesDTO[]>((resolve, reject) => {
      axios
        .post<PlanProdSppConEmbarquesDTO[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllShipmentByMultisIds`,
          multisId,
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllShipmentsByPlanProdId(planProdId: number): Promise<IPlanProdSppEmbarque[]> {
    return new Promise<IPlanProdSppEmbarque[]>((resolve, reject) => {
      axios
        .get<IPlanProdSppEmbarque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllShipmentsByPlanProdId/${planProdId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async MultiPostAndComparateShipings(
    embarques: PlanProdEmbarquesSppListDTO[]
  ): Promise<IPlanProdSppEmbarque[]> {
    return new Promise<IPlanProdSppEmbarque[]>((resolve, reject) => {
      axios
        .post<IPlanProdSppEmbarque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/MultiPostAndComparateShipings`,
          embarques
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async SearchShipmentByNumber(numeroEmbarque: string): Promise<IPlanProdSppEmbarque[]> {
    return new Promise<IPlanProdSppEmbarque[]>((resolve, reject) => {
      axios
        .get<IPlanProdSppEmbarque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/SearchShipmentByNumber/${numeroEmbarque}`
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
