import { IPautaIngenieria } from "app/models/IPautaIngenieria";
import axios from "axios";
import { GenericService } from "./generic.service";

export class PautaIngenieriaService extends GenericService<IPautaIngenieria> {
  Url = "PautaIngenieria";
  constructor() {
    super("PautaIngenieria");
  }

  public getListByLineaProduccionFamiliaId(lineaProduccionFamiliaId: number): Promise<IPautaIngenieria[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPautaIngenieria[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByLineaProduccionFamiliaId/${lineaProduccionFamiliaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getListActivados(): Promise<IPautaIngenieria[]> {
    console.log("service");

    return new Promise((resolve, reject) => {
      axios
        .get<IPautaIngenieria[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListActivados`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  Imprimir(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/Imprimir`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
