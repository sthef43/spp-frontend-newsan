import { GenericService } from "app/services/generic.service";
import { IAuditoriasHistorico } from "../models/IAuditoriasHistorico";
import axios from "axios";

export class AuditoriasHistoricoService extends GenericService<IAuditoriasHistorico> {
  Url = "AuditoriasHistorico";
  constructor() {
    super("AuditoriasHistorico");
  }

  public async GetAllAuditsByPlantId(
    plantaId: number,
    fechaDesde: string,
    fechaHasta: string
  ): Promise<IAuditoriasHistorico[]> {
    return new Promise<IAuditoriasHistorico[]>((resolve, reject) => {
      axios
        .get<IAuditoriasHistorico[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditsByPlantId/${plantaId}/${fechaDesde}/${fechaHasta}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAuditById(id: number): Promise<IAuditoriasHistorico> {
    return new Promise<IAuditoriasHistorico>((resolve, reject) => {
      axios
        .get<IAuditoriasHistorico>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAuditById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
