import { GenericService } from "app/services/generic.service";
import { IAuditoriaAsignada } from "../models/IAuditoriaAsignada";
import axios from "axios";
import { AuditoriaEditDTO, AuditoriaEntidadesDTO } from "../models/DTO/AuditoriaEntidadesDTO";

export class AuditoriaAsignadaService extends GenericService<IAuditoriaAsignada> {
  Url = "AuditoriaAsignada";
  constructor() {
    super("AuditoriaAsignada");
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

  public async UpdateAuditWithResults(entidades: AuditoriaEditDTO): Promise<AuditoriaEditDTO> {
    return new Promise<AuditoriaEditDTO>((resolve, reject) => {
      axios
        .put(`${import.meta.env.VITE_API_URL}/${this.Url}/UpdateAuditWithResults/`, entidades)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllAuditsOfTheDay(
    rolId: number,
    subRolId: number,
    turnoId: number,
    plantId: number
  ): Promise<IAuditoriaAsignada[]> {
    return new Promise<IAuditoriaAsignada[]>((resolve, reject) => {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditsOfTheDay/${rolId}/${subRolId}/${turnoId}/${plantId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAuditResultWithAllDatesById(id: number): Promise<IAuditoriaAsignada> {
    return new Promise<IAuditoriaAsignada>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAuditResultWithAllDatesById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAuditResultWithAllDatesByAuditAsignadaId(id: number): Promise<IAuditoriaAsignada> {
    return new Promise<IAuditoriaAsignada>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAuditResultWithAllDatesByAuditAsignadaId/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllAuditAsignedByAuditId(id: number): Promise<IAuditoriaAsignada[]> {
    return new Promise<IAuditoriaAsignada[]>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditAsignedByAuditId/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
