import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ItemsProcesosResultadosDTO } from "app/features/tickets/models/DTOS/ItemsProcesosResultadosDTO";
import { ITickets } from "app/features/tickets/models/ITickets";

export class TicketsService extends GenericService<ITickets> {
  Url = "Tickets";
  constructor() {
    super("Tickets");
  }

  public async GetAllTicketsByOperatorId(operatorId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsByOperatorId/${operatorId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllByDateCategoríaAndEstado(
    fecha: string,
    categoriaId: number,
    estadoId: number
  ): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllByDateCategoríaAndEstado/${fecha}/${categoriaId}/${estadoId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetTicketsByRol(rolId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetTicketsByRol/${rolId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetTicketsByRolAndColaborador(
    rolId: number,
    colaboradorId: number,
    plantId: number
  ): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetTicketsByRolAndColaborador/${rolId}/${colaboradorId}/${plantId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllColaboradoresByTicketId(ticketId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllColaboradoresByTicketId/${ticketId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsCerrados(categoriaId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsCerrados/${categoriaId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsCloseByDateCategorieAndClient(
    fecha: string,
    categoriaId: number,
    cliente: string
  ): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllTicketsCloseByDateCategorieAndClient/${fecha}/${categoriaId}/${cliente}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllItemsByTicketId(ticketId: number): Promise<ItemsProcesosResultadosDTO[]> {
    return new Promise<ItemsProcesosResultadosDTO[]>((resolve, reject) => {
      axios
        .get<ItemsProcesosResultadosDTO[]>(
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

  public async CreateNewTicketAsync(ticket: ITickets, imagenFile: null): Promise<ITickets> {
    const bodyFormData = new FormData();
    bodyFormData.append("titulo", ticket.titulo);
    bodyFormData.append("ticketsCategoriaId", ticket.ticketsCategoriaId.toString());
    bodyFormData.append("descripcion", ticket.descripcion);
    bodyFormData.append("ticketsEstadoId", ticket.ticketsEstadoId.toString());
    bodyFormData.append("operatorId", ticket.operatorId.toString());
    // bodyFormData.append('archivo', ticket.archivo)
    // bodyFormData.append('tipoArchivo', ticket.tipoArchivo)
    bodyFormData.append("archivoUpload", imagenFile);
    return new Promise<ITickets>((resolve, reject) => {
      axios
        .post<ITickets>(`${import.meta.env.VITE_API_URL}/${this.Url}/CreateNewTicketAsync`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetTicketsByDateCategoriaClientAndEstado(
    fecha: string,
    categoriaId: number,
    cliente: string,
    estadoId: number
  ): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetTicketsByDateCategoriaClientAndEstado/${fecha}/${categoriaId}/${cliente}/${estadoId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsByDateCategorieAndClient(
    fecha: string,
    categoriaId: number,
    cliente: string
  ): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllTicketsByDateCategorieAndClient/${fecha}/${categoriaId}/${cliente}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsByPlantId(plantId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsByPlantId/${plantId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsClose(plantId: number, fechaDesde: string, fechaHasta: string): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsClose/${plantId}/${fechaDesde}/${fechaHasta}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsByDate(fechaDesde: string, fechaHasta: string, plantId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsByDate/${fechaDesde}/${fechaHasta}/${plantId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllRecordsOfTicketsByOperatorId(operatorId: number, fecha: string): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRecordsOfTicketsByOperatorId/${operatorId}/${fecha}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async SearchTicketBySdOption(sdTicket: string): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchTicketBySdOption/${sdTicket}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsByDatesAndOperatorId(operatorId: number, fechaDesde: string): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsByDatesAndOperatorId/${operatorId}/${fechaDesde}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetTicketById(id: number): Promise<ITickets> {
    return new Promise<ITickets>((resolve, reject) => {
      axios
        .get<ITickets>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetTicketById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsByPlantOperatorInclusiveClosedTickets(plantId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsByPlantOperatorInclusiveClosedTickets/${plantId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllTicketsByOperatorIdInclusiveClosed(operatorId: number): Promise<ITickets[]> {
    return new Promise<ITickets[]>((resolve, reject) => {
      axios
        .get<ITickets[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllTicketsByOperatorIdInclusiveClosed/${operatorId}`
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
