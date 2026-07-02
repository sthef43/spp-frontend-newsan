/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IRoutesAyuda } from "app/features/ayuda/models/IRoutesAyuda";
import { GenericService } from "../../../services/generic.service";
import axios from "axios";

export class RoutesAyudaService extends GenericService<IRoutesAyuda> {
  Url = "RoutesAyuda";
  constructor() {
    super("RoutesAyuda");
  }

  UploadFile(ruta: string, padre: string, file: File, nombrePdf: string, routesAyudaPadresId: string) {
    const bodyFormData = new FormData();
    bodyFormData.append("ruta", ruta);
    bodyFormData.append("Padre", padre);
    bodyFormData.append("pdf", file);
    bodyFormData.append("nombrePdf", nombrePdf);
    bodyFormData.append("routesAyudaPadresId", routesAyudaPadresId);
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/UploadFile`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((data) => resolve(data.data))
        .catch((error) => reject(error));
    });
  }

  public GetAllByPadre(padre: string): Promise<IRoutesAyuda[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRoutesAyuda[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPadre/${padre}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public GetAllPadre(): Promise<IRoutesAyuda[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRoutesAyuda[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPadre`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
