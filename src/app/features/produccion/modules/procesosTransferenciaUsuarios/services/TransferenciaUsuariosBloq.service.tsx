import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITransferenciaUsuariosBloq } from "../models/ITransferenciaUsuariosBloq";

export class TransferenciaUsuariosBloqService extends GenericService<ITransferenciaUsuariosBloq> {
  Url = "TransferenciaUsuariosBloq";
  constructor() {
    super("TransferenciaUsuariosBloq");
  }

  public async GetBloqByUsuarioIdAndSectorId(usuarioId: number, sectorId: number): Promise<ITransferenciaUsuariosBloq> {
    return new Promise<ITransferenciaUsuariosBloq>((resolve, reject) => {
      axios
        .get<ITransferenciaUsuariosBloq>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetBloqByUsuarioIdAndSectorId/${usuarioId}/${sectorId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllBloqsByUserId(usuarioId: number): Promise<ITransferenciaUsuariosBloq[]> {
    return new Promise<ITransferenciaUsuariosBloq[]>((resolve, reject) => {
      axios
        .get<ITransferenciaUsuariosBloq[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllBloqsByUserId/${usuarioId}`
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
