import { IModelo } from "app/models/IModelo";
import axios from "axios";
import { GenericService } from "./generic.service";

export class ModeloService extends GenericService<IModelo> {
  Url = "Modelo";
  constructor() {
    super("Modelo");
  }
  public getAllByFamiliaId(familiaId: number): Promise<IModelo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByFamiliaId/${familiaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByNombre(nombre: string): Promise<IModelo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByNombre/${nombre}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllModelsByFamiliasOfLines(lineaProduccionId: number): Promise<IModelo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllModelsByFamiliasOfLines/${lineaProduccionId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetModelById(nombreModelo: string): Promise<IModelo> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelo>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetModelById/${nombreModelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public async GetAllModelsActivateByRenacer(): Promise<IModelo[]> {
    return new Promise<IModelo[]>((resolve, reject) => {
      axios
        .get<IModelo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllModelsActivateByRenacer`)
        .then((response) => { resolve(response.data) })
        .catch((error) => { reject(error) })
    })
  }
}
