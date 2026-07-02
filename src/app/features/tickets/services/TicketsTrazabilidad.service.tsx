import axios from "axios";
import { GenericService } from "app/services/generic.service";
import { ITicketsTrazabilidad } from "app/features/tickets/models/ITicketsTrazabilidad";
import { IAgrupacionTrazabilidadTicketsDTO } from "app/features/tickets/models/DTOS/IAgrupacionTrazabilidadTicketsDTO";

export class TicketsTrazabilidadService extends GenericService<ITicketsTrazabilidad> {
  Url = "TicketsTrazabilidad";
  constructor() {
    super("TicketsTrazabilidad");
  }

  public async GetAllByTicketId(ticketId: number): Promise<ITicketsTrazabilidad[]> {
    return new Promise<ITicketsTrazabilidad[]>((resolve, reject) => {
      axios
        .get<ITicketsTrazabilidad[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTicketId/${ticketId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTracesOfTicketsGroup(ticketId: number): Promise<IAgrupacionTrazabilidadTicketsDTO> {
    return new Promise<IAgrupacionTrazabilidadTicketsDTO>((resolve, reject) => {
      axios
        .get<IAgrupacionTrazabilidadTicketsDTO>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTracesOfTicketsGroup/${ticketId}`
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
