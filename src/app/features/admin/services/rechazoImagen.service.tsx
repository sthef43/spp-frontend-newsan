import { IRechazoImagen } from "app/models/IRechazoImagen";
import { GenericService } from "app/services/generic.service";
import axios from "axios";
export class RechazoImagenService extends GenericService<IRechazoImagen> {
  url = "RechazoImagen";
  constructor() {
    super("RechazoImagen");
  }
  public getAllByPuestoIdRequest(id: number): Promise<IRechazoImagen[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazoImagen[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByPuestoId/${id}`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public UploadImagen(rechazoImagenId: string, imageFile: any) {
    const bodyFormData = new FormData();
    console.log(imageFile);
    bodyFormData.append("image", imageFile);
    bodyFormData.append("rechazoImagenId", rechazoImagenId);
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.url}/UploadImage`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((data) => resolve(data.data.result))
        .catch((error) => reject(error));
    });
  }
}
