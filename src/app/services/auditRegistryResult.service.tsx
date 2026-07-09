import { IAuditRegistryResult } from "app/models/IAuditRegistryResult";
import axios from "axios";
import { GenericService } from "./generic.service";

export class AuditRegistryResultService extends GenericService<IAuditRegistryResult> {
  Url = "AuditRegistryResult";
  constructor() {
    super("AuditRegistryResult");
  }
  GetAllByIdAndFlag(id: number): Promise<IAuditRegistryResult> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditRegistryResult>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByIdAndFlag/${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  SetResolver(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SetResolver/${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
