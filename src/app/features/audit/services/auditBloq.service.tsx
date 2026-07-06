import { IAuditBloq } from "app/models/IAuditBloq";
import axios from "axios";
import { GenericService } from "app/services/generic.service";

export class AuditBloqService extends GenericService<IAuditBloq> {
  Url = "AuditBloq";
  constructor() {
    super("AuditBloq");
  }
  Upload(bloqName: string, id: number, imageFile: any) {
    const idString = id.toString();
    const bodyFormData = new FormData();
    console.log(imageFile);
    bodyFormData.append("image", imageFile);
    bodyFormData.append("bloqName", bloqName);
    bodyFormData.append("id", idString);
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/upload`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((data) => resolve(data.data.result))
        .catch((error) => reject(error));
    });
  }
}
