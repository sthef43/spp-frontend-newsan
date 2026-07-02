import { GenericService } from "app/services/generic.service";
import { IAuditoriaListaValores } from "../models/IAuditoriaListaValores";
import axios from "axios";
import { IAuditoriaValores } from "../models/IAuditoriaValores";
import { ListaValoresRenderizadoDTO } from "../models/DTO/ListaValoresRenderizadoDTO";

export class AuditoriaListaValoresService extends GenericService<IAuditoriaListaValores> {
  Url = "AuditoriaListaValores";
  constructor() {
    super("AuditoriaListaValores");
  }

  public async GetAuditById(id: number): Promise<IAuditoriaValores[]> {
    return new Promise<IAuditoriaValores[]>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAuditById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllListWithValues(): Promise<IAuditoriaListaValores[]> {
    return new Promise<IAuditoriaListaValores[]>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllListWithValues`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllListWithoutType(): Promise<IAuditoriaListaValores[]> {
    return new Promise<IAuditoriaListaValores[]>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllListWithoutType`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAuditListWithRolId(id: number): Promise<IAuditoriaListaValores[]> {
    return new Promise<IAuditoriaListaValores[]>((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAuditListWithRolId/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllListWithoutTypeAndState(): Promise<ListaValoresRenderizadoDTO> {
    return new Promise<ListaValoresRenderizadoDTO>((resolve, reject) => {
      axios
        .get<ListaValoresRenderizadoDTO>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllListWithoutTypeAndState`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllAuditsByTypeAuditId(id: number): Promise<IAuditoriaValores[]> {
    return new Promise<IAuditoriaValores[]>((resolve, reject) => {
      axios
        .get<IAuditoriaValores[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllAuditsByTypeAuditId/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
