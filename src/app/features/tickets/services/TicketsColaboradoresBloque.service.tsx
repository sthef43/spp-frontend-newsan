import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsColaboradoresBloque } from "app/features/tickets/models/ITicketsColaboradoresBloque";

export class TicketsColaboradoresBloqueService extends GenericService<ITicketsColaboradoresBloque> {
  Url = "TicketsColaboradoresBloque";
  constructor() {
    super("TicketsColaboradoresBloque");
  }

  public async GetAllColabsByTicket(id: number): Promise<ITicketsColaboradoresBloque[]> {
    return new Promise<ITicketsColaboradoresBloque[]>((resolve, reject) => {
      axios
        .get<ITicketsColaboradoresBloque[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllColabsByTicket/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async SearchColaborador(colaboradorId: number, ticketId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetColaborador/${colaboradorId}/${ticketId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
