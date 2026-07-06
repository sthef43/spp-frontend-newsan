import { IAuditRegistry } from "app/models/IAuditRegistry";
import axios from "axios";
import { GenericService } from "app/services/generic.service";

export class AuditRegistryService extends GenericService<IAuditRegistry> {
  Url = "AuditRegistry";
  constructor() {
    super("AuditRegistry");
  }
  public getbyRolId(rolId: number): Promise<IAuditRegistry[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditRegistry[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getbyRolId/${rolId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getPaginatedbyRolId(plantId: number, rolId: number): Promise<IAuditRegistry[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditRegistry[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPaginatedByRol/${plantId}/${rolId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  GetAllByIdAndFlag(id: number): Promise<IAuditRegistry> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditRegistry>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByIdAndFlag/${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  CanceledRequest(id: number, username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/Canceled/${id}/${username}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
