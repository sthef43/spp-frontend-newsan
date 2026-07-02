import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { EmbarquesPlanProdIdDTO } from "../models/DTOS/EmbarquesPlanProdIdDTO";
import { IPlanProdSpp } from "../models/IPlanProdSpp";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";
import { IPlanProdSppEmbarquesBloque } from "../models/IPlanProdSppEmbarqueBloque";

export class PlanProdSppEmbarqueBloqueService extends GenericService<IPlanProdSppEmbarquesBloque> {
  Url = "PlanProdSppEmbarqueBloque";
  constructor() {
    super("PlanProdSppEmbarqueBloque");
  }

  public async AssignShipmentsToPlans(planes: IPlanProdSpp[]): Promise<IPlanProdSppEmbarquesBloque[]> {
    return new Promise<IPlanProdSppEmbarquesBloque[]>((resolve, reject) => {
      axios
        .post<IPlanProdSppEmbarquesBloque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/AssignShipmentsToPlans`,
          planes
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GenerateShipments(embarquesAndPlansId: EmbarquesPlanProdIdDTO): Promise<IPlanProdSppEmbarque[]> {
    return new Promise<IPlanProdSppEmbarque[]>((resolve, reject) => {
      axios
        .post<IPlanProdSppEmbarque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GenerateShipments`,
          embarquesAndPlansId
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
