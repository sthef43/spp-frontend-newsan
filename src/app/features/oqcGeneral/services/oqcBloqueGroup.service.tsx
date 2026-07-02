import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";

export class OQCBloqueGroupService extends GenericService<IOQCBloqueGroup> {
  Url = "OQCBloqueGroup";
  constructor() {
    super("OQCBloqueGroup");
  }
  uploadImages(model: Array<{ oqcBloqueGroupId: number; image: any }>): Promise<boolean> {
    const bodyFormData = new FormData();
    for (const image of model) {
      bodyFormData.append("files", image.image);
      bodyFormData.append("oqcBloqueGroupId", image.oqcBloqueGroupId.toString());
    }
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
}
