import { GenericService } from "app/services/generic.service";
import { ITicketsMensajesUsuario } from "app/features/tickets/models/ITicketsMensajesUsuario";
import axios from "axios";
import { saveAs } from "file-saver";

export class TicketsMensajesUsuariosServices extends GenericService<ITicketsMensajesUsuario> {
  Url = "TicketsMensajesUsuarios";
  constructor() {
    super("TicketsMensajesUsuarios");
  }

  public async GetAllMensajesByTicketId(ticketId: number): Promise<ITicketsMensajesUsuario[]> {
    return new Promise<ITicketsMensajesUsuario[]>((resolve, reject) => {
      axios
        .get<ITicketsMensajesUsuario[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllMensajesByTicketId/${ticketId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async CreateNewMessageWithImage(
    mensajeUsuario: ITicketsMensajesUsuario,
    imagenFile: null
  ): Promise<ITicketsMensajesUsuario> {
    const bodyFormData = new FormData();
    bodyFormData.append("mensaje", mensajeUsuario.mensaje);
    bodyFormData.append("operatorId", mensajeUsuario.operatorId.toString());
    bodyFormData.append("ticketId", mensajeUsuario.ticketsId.toString());
    bodyFormData.append("archivo", imagenFile);
    return new Promise<ITicketsMensajesUsuario>((resolve, reject) => {
      axios
        .post<ITicketsMensajesUsuario>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/CreateNewMessageWithImage`,
          bodyFormData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DownloadArchiveMessageTicket(ticketId: number | string, nombreArchivo: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/DownloadArchiveMessageTicket/${ticketId}/${nombreArchivo}`,
          {
            responseType: "blob"
          }
        )
        .then((response) => {
          saveAs(response.data, nombreArchivo);
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetImageMessageTicket(ticketId: number | string, nombreArchivo: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios
        .get<Blob>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetImageMessageTicket/${ticketId}/${nombreArchivo}`, {
          responseType: "blob"
        })
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async CreateNewMessage(mensajeUsuario: ITicketsMensajesUsuario): Promise<ITicketsMensajesUsuario> {
    return new Promise<ITicketsMensajesUsuario>((resolve, reject) => {
      axios
        .post<ITicketsMensajesUsuario>(`${import.meta.env.VITE_API_URL}/${this.Url}/CreateNewMessage`, mensajeUsuario)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
