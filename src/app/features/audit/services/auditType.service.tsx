import { IAuditType } from "app/models/IAuditType";
import { GenericService } from "app/services/generic.service";
import axios from "axios";

export class AuditTypeService extends GenericService<IAuditType> {
  Url = "AuditType";
  constructor() {
    super("AuditType");
  }

  public GetAllByRolId(rolId: number) {
    return new Promise<IAuditType[]>((resolve, rejected) => {
      axios
        .get<IAuditType[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByRolId/${rolId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          rejected(error);
        });
    });
  }
}
