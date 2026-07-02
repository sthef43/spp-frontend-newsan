import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsItemsProcesos } from "app/features/tickets/models/ITicketsItemsProcesos";

export class TicketsItemsProcesosService extends GenericService<ITicketsItemsProcesos> {
  Url = "TicketsItemsProcesos";
  constructor() {
    super("TicketsItemsProcesos");
  }

  public async GetAllItemsWithoutGroup(grupoId: number, categoriaId: number): Promise<ITicketsItemsProcesos[]> {
    return new Promise<ITicketsItemsProcesos[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesos[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsWithoutGroup/${grupoId}/${categoriaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllWithGroup(grupoId: number): Promise<ITicketsItemsProcesos[]> {
    return new Promise<ITicketsItemsProcesos[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWithGroup/${grupoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsByRolId(rolId: number): Promise<ITicketsItemsProcesos[]> {
    return new Promise<ITicketsItemsProcesos[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsByRolId/${rolId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
