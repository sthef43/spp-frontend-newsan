import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsItemsProcesosResultados } from "app/features/tickets/models/ITicketsItemsProcesosResultados";

export class TicketsItemsProcesosResultadoService extends GenericService<ITicketsItemsProcesosResultados> {
  Url = "TicketsItemsProcesosResultados";
  constructor() {
    super("TicketsItemsProcesosResultados");
  }

  public async GetAllItemsByTicketId(ticketId: number): Promise<ITicketsItemsProcesosResultados[]> {
    return new Promise<ITicketsItemsProcesosResultados[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesosResultados[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsByTicketId/${ticketId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetItemResultadoById(itemId: number, ticketId: number): Promise<ITicketsItemsProcesosResultados> {
    return new Promise<ITicketsItemsProcesosResultados>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesosResultados>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetItemResultadoById/${itemId}/${ticketId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsAprobedByTicketsId(ticketId: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsAprobedByTicketsId/${ticketId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsByTicketIdForApproval(ticketId: number): Promise<ITicketsItemsProcesosResultados[]> {
    return new Promise<ITicketsItemsProcesosResultados[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesosResultados[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsByTicketIdForApproval/${ticketId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsByContainIds(ids: number[]): Promise<ITicketsItemsProcesosResultados[]> {
    return new Promise<ITicketsItemsProcesosResultados[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesosResultados[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsByContainIds/${ids}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsByBloq(ticketId: number): Promise<ITicketsItemsProcesosResultados[]> {
    return new Promise<ITicketsItemsProcesosResultados[]>((resolve, reject) => {
      axios
        .get<ITicketsItemsProcesosResultados[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsByBloq/${ticketId}`
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
