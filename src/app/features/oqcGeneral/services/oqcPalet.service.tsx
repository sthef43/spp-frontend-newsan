import { IOQCPalet } from "app/models/IOQCPalet";
import { GenericService } from "../../../services/generic.service";
import axios from "axios";

export class OQCPaletService extends GenericService<IOQCPalet> {
  Url = "OQCPalet";
  constructor() {
    super("OQCPalet");
  }
  public GetAllByOQCandModelo(oqcDesiId: number, modeloId: number): Promise<IOQCPalet> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByOQCandModeloId/${oqcDesiId}/${modeloId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByModeloId({ modeloId, lineaId }): Promise<IOQCPalet[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByModeloId/${modeloId}/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetLPNGeneric(): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .get<string>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLPNGeneric`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByLPN(LPN: string): Promise<IOQCPalet> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLPN/${LPN}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllDatesPalletByPlantAndModelId(plantId: number, modeloId: number): Promise<IOQCPalet[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllDatesPalletByPlantAndModelId/${plantId}/${modeloId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllPaletsByModel(modeloId: number): Promise<IOQCPalet[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPaletsByModel/${modeloId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetLastPalet(): Promise<IOQCPalet> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLastPalet`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public SearchPaletOpen(modeloId: number): Promise<IOQCPalet> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchPaletOpen/${modeloId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetLastTwoPallets(plantId: number, modeloId: number): Promise<IOQCPalet[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLastTwoPallets/${plantId}/${modeloId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetPalletWithRechazos(palletId: number): Promise<IOQCPalet> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPalet>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPalletWithRechazos/${palletId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
