import { ICodigoSoldadura } from "app/models/ICodigoSoldadura";
import axios from "axios";

export class CodigoSoldaduraService {
  constructor(public url = "CodigoSoldadura") {}
  getAll(): Promise<ICodigoSoldadura[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICodigoSoldadura[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getAll`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getListByGenerico(generico: string): Promise<ICodigoSoldadura[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICodigoSoldadura[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getListByGenerico/${generico}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  postRequest(entity: ICodigoSoldadura): Promise<boolean> {
    
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  putRequest(entity: ICodigoSoldadura): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deleteRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}?id=${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

    public UploadImagen(generico: string, puesto:string ,imageFile: any) {
    const bodyFormData = new FormData();
    console.log(imageFile);
    bodyFormData.append("image", imageFile);
    
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.url}/UploadImage/${generico}/${puesto}`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((data) => resolve(data.data))
        .catch((error) => reject(error));
    });
  }
}
