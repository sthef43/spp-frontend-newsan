import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsItemsProcesosBloque } from "app/features/tickets/models/ITicketsItemsProcesosBloque";

export class TicketsItemsProcesosBloquesService extends GenericService<ITicketsItemsProcesosBloque> {
  Url = "TicketsItemsProcesosBloque";
  constructor() {
    super("TicketsItemsProcesosBloque");
  }

  public async GetAllItemsByAddInBloq(itemId: number): Promise<ITicketsItemsProcesosBloque[]> {
    return new Promise<ITicketsItemsProcesosBloque[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesosBloque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsByAddInBloq/${itemId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsByGroupProccesId(groupId: number): Promise<ITicketsItemsProcesosBloque[]> {
    return new Promise<ITicketsItemsProcesosBloque[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesosBloque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsByGroupProccesId/${groupId}`
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
