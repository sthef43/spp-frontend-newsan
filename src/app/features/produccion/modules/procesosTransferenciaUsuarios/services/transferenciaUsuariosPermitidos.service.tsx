import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITransferenciaUsuariosPermitidos } from "../models/ITransferenciaUsuariosPermitidos";

export class TransferenciaUsuariosPermitidosService extends GenericService<ITransferenciaUsuariosPermitidos> {
  Url = "TransferenciaUsuariosPermitidos";
  constructor() {
    super("TransferenciaUsuariosPermitidos");
  }

  public async GetAllUsersBySectorId(sectorId: number): Promise<ITransferenciaUsuariosPermitidos[]> {
    return new Promise<ITransferenciaUsuariosPermitidos[]>((resolve, reject) => {
      axios
        .get<ITransferenciaUsuariosPermitidos[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllUsersBySectorId/${sectorId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetUserByDni(dni: string): Promise<ITransferenciaUsuariosPermitidos> {
    return new Promise<ITransferenciaUsuariosPermitidos>((resolve, reject) => {
      axios
        .get<ITransferenciaUsuariosPermitidos>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUserByDni/${dni}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
