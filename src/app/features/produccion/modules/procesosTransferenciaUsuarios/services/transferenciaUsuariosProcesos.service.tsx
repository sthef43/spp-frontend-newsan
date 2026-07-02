import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITransferenciaUsuariosProcesos } from "../models/ITransferenciaUsuariosProcesos";

export class TransferenciaUsuariosProcesosService extends GenericService<ITransferenciaUsuariosProcesos> {
  Url = "TransferenciaUsuariosProcesos";
  constructor() {
    super("TransferenciaUsuariosProcesos");
  }

  public async GetAllProcessBySectorId(sectorId: number): Promise<ITransferenciaUsuariosProcesos[]> {
    return new Promise<ITransferenciaUsuariosProcesos[]>((resolve, reject) => {
      axios
        .get<ITransferenciaUsuariosProcesos[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllProcessBySectorId/${sectorId}`
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
