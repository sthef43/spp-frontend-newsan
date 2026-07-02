import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCDesignadaResultadoImagen } from "app/models/IOQCDesignadaResultadoImagen";

export class OQCDesignadaResultadoImagenService extends GenericService<IOQCDesignadaResultadoImagen> {
  Url = "OQCDesignadaResultadoImagen";
  constructor() {
    super("OQCDesignadaResultadoImagen");
  }
  uploadImages(model: Array<{ oqcDesigResultId: number; oqcBloqueGroupId: number; image: any }>): Promise<boolean> {
    const bodyFormData = new FormData();
    for (const image of model) {
      bodyFormData.append("files", image.image);
      bodyFormData.append("oqcBloqueGroupId", image.oqcBloqueGroupId.toString());
    }
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/UploadMultiple/${model[0].oqcDesigResultId}`,
          bodyFormData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
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
