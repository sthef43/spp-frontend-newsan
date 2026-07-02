import { GenericService } from "app/services/generic.service";
import { IAuditoria } from "../models/IAuditoria";
import axios from "axios";
import { AuditoriaEntidadesDTO } from "../models/DTO/AuditoriaEntidadesDTO";

export class AuditoriaService extends GenericService<IAuditoria> {
  Url = "Auditoria";
  constructor() {
    super("Auditoria");
  }

  public async CreateAuditWithResults(entidades: AuditoriaEntidadesDTO): Promise<AuditoriaEntidadesDTO> {
    return new Promise<AuditoriaEntidadesDTO>((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/CreateAuditWithResults/`, entidades)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllAuditsFatherByRolAndPlantId(idPlant: number, idRol: number): Promise<IAuditoria> {
    return new Promise<IAuditoria>((resolve, reject) => {
      axios
        .get<IAuditoria>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditsFatherByRolAndPlantId/${idPlant}/${idRol}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAuditoriasByPlant(idPlant: number): Promise<IAuditoria[]> {
    return new Promise<IAuditoria[]>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAuditoriasByPlant/${idPlant}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllAuditsByRolAndPlantId(idPlant: number, idRol: number): Promise<IAuditoria> {
    return new Promise<IAuditoria>((resolve, reject) => {
      axios
        .get<IAuditoria>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditsByRolAndPlantId/${idPlant}/${idRol}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
