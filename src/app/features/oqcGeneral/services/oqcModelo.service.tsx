import { IOQCModelo } from "app/models/IOQModelo";
import axios from "axios";
import { GenericService } from "../../../services/generic.service";

export class OQCModeloService extends GenericService<IOQCModelo> {
  Url = "OQCModelo";
  constructor() {
    super("OQCModelo");
  }
  public GetAllByLineaId(lineaId: number): Promise<IOQCModelo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCModelo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllBylineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetModeloByEanCode(eanCode: string): Promise<IOQCModelo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCModelo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByEanCode/${eanCode}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllModelsActivate(lineaId: number): Promise<IOQCModelo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCModelo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllModelsActivate/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
