import { GenericService } from "app/services/generic.service";
import { ITicketsEstados } from "app/features/tickets/models/ITicketsEstado";

export class TicketsEstadoService extends GenericService<ITicketsEstados> {
  Url = "TicketsEstado";
  constructor() {
    super("TicketsEstado");
  }
}
