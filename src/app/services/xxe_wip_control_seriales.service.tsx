import axios from "axios";
import { IXXE_WIP_CONTROL_SERIALES } from "app/models/IXXE_WIP_CONTROL_SERIALES";

export class XXE_WIP_CONTROL_SERIALESService {
  Url = "XXE_WIP_CONTROL_SERIALES";
  public getAllByCodigoModeloRequest({ codigoModelo, tipoUnidad }): Promise<IXXE_WIP_CONTROL_SERIALES[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_CONTROL_SERIALES[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCodigoModelo/${codigoModelo}/${tipoUnidad}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByCodigoModelo(codigoModelo: string): Promise<IXXE_WIP_CONTROL_SERIALES[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_CONTROL_SERIALES[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigoModelo/${codigoModelo}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  //GetByOrganizationCodeItem(string organizationCode, string item)
  public GetByOrganizationCodeItem({ organizationCode, item }): Promise<IXXE_WIP_CONTROL_SERIALES[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_CONTROL_SERIALES[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByOrganizationCodeItem/${organizationCode}/${item}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }  

}
