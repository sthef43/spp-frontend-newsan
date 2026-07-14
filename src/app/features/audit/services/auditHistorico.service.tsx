import { IAuditHistorico } from "app/models/IAuditHistorico";
import { GenericService } from "app/services/generic.service";
import axios from "axios";

export class AuditHistoricoService extends GenericService<IAuditHistorico> {
  Url = "AuditHistorico";
  constructor() {
    super("AuditHistorico");
  }

  public GetAllAuditHistoricsByPlantRolDatesAndLineId(
    plantId: number,
    rolId: number,
    lineId: number,
    tipoMuestra: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<IAuditHistorico[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditHistorico[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditHistoricsByPlantRolDatesAndLineId/${plantId}/${rolId}/${lineId}/${tipoMuestra}/${fechaDesde}/${fechaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
