import { GenericService } from "app/services/generic.service";
import { ITicketsArchivos } from "app/features/tickets/models/ITicketsArchivos";
import axios from "axios";
import { saveAs } from "file-saver";

export class TicketsArchivosService extends GenericService<ITicketsArchivos> {
  Url = "TicketsArchivos";
  constructor() {
    super("TicketsArchivos");
  }

  public async PublishNewTicketFiles(ticketId: string, listaArchivos: any[]): Promise<boolean> {
    const bodyFormData = new FormData();
    bodyFormData.append("ticketId", ticketId);
    listaArchivos.forEach((elemento) => {
      bodyFormData.append("archivos", elemento.file);
    });
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/PublishNewTicketFiles`, bodyFormData, {
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

  public async DownloadArchiveTicket(ticketId: number | string, nombreArchivo: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/DownloadArchiveTicket/${ticketId}/${nombreArchivo}`,
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

  public async GetImageTicketPreview(ticketId: number | string, nombreArchivo: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios
        .get<Blob>(`${import.meta.env.VITE_API_URL}/${this.Url}/DownloadArchiveTicket/${ticketId}/${nombreArchivo}`, {
          responseType: "blob"
        })
        .then((response) => {
          const imagenUrl = URL.createObjectURL(response.data);
          resolve(imagenUrl);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetFilesByTicketId(ticketId: number): Promise<ITicketsArchivos[]> {
    return new Promise<ITicketsArchivos[]>((resolve, reject) => {
      axios
        .get<ITicketsArchivos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetFilesByTicketId/${ticketId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
