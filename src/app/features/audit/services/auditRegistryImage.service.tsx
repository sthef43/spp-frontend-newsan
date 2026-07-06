import { IAuditRegistryImage } from "app/models/IAuditRegistryImage";
import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IAuditImage } from "app/models/IAuditImage";

export class AuditRegistryImageService extends GenericService<IAuditRegistryImage> {
  Url = "AuditRegistryImage";
  constructor() {
    super("AuditRegistryImage");
  }
  uploadImages(model: IAuditImage[]): Promise<boolean> {
    const bodyFormData = new FormData();
    for (const image of model) {
      bodyFormData.append("files", image.file);
      bodyFormData.append("auditBloqId", image.auditBloqId.toString());
    }
    bodyFormData.append("auditRegistryId", model[0].auditRegistryId.toString());
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/UploadMultiple`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getImage({ auditRegistryId, auditBloqId }): Promise<IAuditRegistryImage[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditRegistryImage[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetImage/${auditRegistryId}/${auditBloqId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getImageByIds({ auditRegistryId, auditBloqId }): Promise<IAuditRegistryImage> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditRegistryImage>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetImageByIds/${auditRegistryId}/${auditBloqId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
