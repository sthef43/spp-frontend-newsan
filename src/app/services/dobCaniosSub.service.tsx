import axios from "axios";
import { GenericService } from "./generic.service";
import { IDobCaniosSub } from "app/models/IDobCaniosSub";
import { IDobCaniosSubDto } from "app/models/IDobCaniosSubDto";

export class DobCaniosSubService extends GenericService<IDobCaniosSub> {
  Url = "DobCaniosSub";
  constructor() {
    super("DobCaniosSub");
  }
  public GetListByLpn(lpn: string): Promise<IDobCaniosSub[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobCaniosSub[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByLpn/${lpn}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }  
  public GetListByNumeroOP(numeroOP: string): Promise<IDobCaniosSubDto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobCaniosSubDto[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByNumeroOP/${numeroOP}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }  
}
