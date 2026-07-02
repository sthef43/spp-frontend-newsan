import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ICLIContenedorItemsRecepcionBloq } from "../Models/ICLIContenedorItemsRecepcionBloq";

export class CLIContenedorItemsRecepcionBloqService extends GenericService<ICLIContenedorItemsRecepcionBloq> {
  Url = "CLIContenedorItemsRecepcionBloq";
  constructor() {
    super("CLIContenedorItemsRecepcionBloq");
  }

  public async GetAllReceptionByContenedorId(contenedorId: number): Promise<ICLIContenedorItemsRecepcionBloq[]> {
    return new Promise<ICLIContenedorItemsRecepcionBloq[]>((resolve, reject) => {
      axios
        .get<ICLIContenedorItemsRecepcionBloq[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllReceptionByContenedorId/${contenedorId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetLastContainerReceived(contenedorId: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLastContainerReceived/${contenedorId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllContainerIemsByStateReceived(
    tipoFiltrado: string,
    sectorId: number
  ): Promise<ICLIContenedorItemsRecepcionBloq[]> {
    return new Promise<ICLIContenedorItemsRecepcionBloq[]>((resolve, reject) => {
      axios
        .get<ICLIContenedorItemsRecepcionBloq[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllContainerIemsByStateReceived/${tipoFiltrado}/${sectorId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async SearchContainerWithNotReception(lpn: string): Promise<ICLIContenedorItemsRecepcionBloq> {
    return new Promise<ICLIContenedorItemsRecepcionBloq>((resolve, reject) => {
      axios
        .get<ICLIContenedorItemsRecepcionBloq>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/SearchContainerWithNotReception/${lpn}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetFirsBloqCreatByContenedorId(contenedorId: number): Promise<ICLIContenedorItemsRecepcionBloq> {
    return new Promise<ICLIContenedorItemsRecepcionBloq>((resolve, reject) => {
      axios
        .get<ICLIContenedorItemsRecepcionBloq>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetFirsBloqCreatByContenedorId/${contenedorId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetContenedorBloqBySectorAndContenedorId(
    sectorId: number,
    contenedorId: number
  ): Promise<ICLIContenedorItemsRecepcionBloq> {
    return new Promise<ICLIContenedorItemsRecepcionBloq>((resolve, reject) => {
      axios
        .get<ICLIContenedorItemsRecepcionBloq>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetContenedorBloqBySectorAndContenedorId/${sectorId}/${contenedorId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllContenedoresBloqBySectorAndContenedorId(
    sectorId: number
  ): Promise<ICLIContenedorItemsRecepcionBloq[]> {
    return new Promise<ICLIContenedorItemsRecepcionBloq[]>((resolve, reject) => {
      axios
        .get<ICLIContenedorItemsRecepcionBloq[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllContenedoresBloqBySectorAndContenedorId/${sectorId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllContainerByUserWithPermissions(usuarioId: number): Promise<ICLIContenedorItemsRecepcionBloq[]> {
    return new Promise<ICLIContenedorItemsRecepcionBloq[]>((resolve, reject) => {
      axios
        .get<ICLIContenedorItemsRecepcionBloq[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllContainerByUserWithPermissions/${usuarioId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
