import { IAudit } from "app/models/IAudit";
import { GenericService } from "./generic.service";
import axios from "axios";

export class AuditService extends GenericService<IAudit> {
  Url = "Audit";
  constructor() {
    super("Audit");
  }
  public getAllByPlantIdAndRol({ plantId, rolId }): Promise<IAudit[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAudit[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPlantIdAndRol/${plantId}/${rolId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
