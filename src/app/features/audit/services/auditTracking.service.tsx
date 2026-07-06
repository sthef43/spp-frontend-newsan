import { IAuditTracking } from "app/models/IAuditTracking";
import axios from "axios";
import { GenericService } from "app/services/generic.service";

export class AuditTrackingService extends GenericService<IAuditTracking> {
  url = "AuditTracking";
  constructor() {
    super("AuditTracking");
  }
  public GetAllByARId(id: number) {
    return new Promise<IAuditTracking[]>((resolve, rejected) => {
      axios
        .get<IAuditTracking[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByARId/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          rejected(error);
        });
    });
  }
  public GetAllByRolId(id: number) {
    return new Promise<IAuditTracking[]>((resolve, rejected) => {
      axios
        .get<IAuditTracking[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByRolId/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          rejected(error);
        });
    });
  }
}
