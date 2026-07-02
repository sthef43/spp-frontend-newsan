import { IMaterialesImagen } from "app/models/IMaterialesImagen";
import axios from "axios";
import { GenericService } from "./generic.service";

export class MaterialesImagenService extends GenericService<IMaterialesImagen> {
  Url = "MaterialesImagen";
  constructor() {
    super("MaterialesImagen");
  }

  Upload(material: string, imageFile: any) {
    const bodyFormData = new FormData();
    console.log(imageFile);
    bodyFormData.append("image", imageFile);
    bodyFormData.append("material", material);
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.url}/upload`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((data) => resolve(data.data.result))
        .catch((error) => reject(error));
    });
  }
  getByCodigoWip(codigoWip: string) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/${this.url}/getByCodigoWip/${codigoWip}`)
        .then((data) => resolve(data.data))
        .catch((error) => reject(error));
    });
  }
}
