import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { GenericService } from "../../../services/generic.service";
import axios from "axios";

export class OQCHallazgoService extends GenericService<IOQCHallazgo> {
  Url = "OQCHallazgo";
  constructor() {
    super("OQCHallazgo");
  }
  public GetAllByProductoId(productoId: number): Promise<IOQCHallazgo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCHallazgo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductoId/${productoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllByProductoIdAndCategoria(productoId: number, categoriaId: number): Promise<IOQCHallazgo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCHallazgo[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductoIdAndCategoria/${productoId}/${categoriaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async UploadImageHallazgo(hallazgoId: string, file: any): Promise<boolean> {
    const bodyFormData = new FormData();
    bodyFormData.append("hallazgoId", hallazgoId);
    bodyFormData.append("file", file);
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/UploadImageHallazgo`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
