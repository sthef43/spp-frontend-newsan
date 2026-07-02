import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsGrupoProcesos } from "app/features/tickets/models/iTicketsGrupoProcesos";

export class TicketsGruposProcesosService extends GenericService<ITicketsGrupoProcesos> {
  Url = "TicketsGrupoProcesos";
  constructor() {
    super("TicketsGrupoProcesos");
  }

  public async GetGrupoProcesosWithItemsById(id: number): Promise<ITicketsGrupoProcesos> {
    return new Promise<ITicketsGrupoProcesos>((resolve, reject) => {
      axios
        .get<ITicketsGrupoProcesos>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetGrupoProcesosWithItemsById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllGroupsByCategoriaId(categoriaId: number): Promise<ITicketsGrupoProcesos[]> {
    return new Promise<ITicketsGrupoProcesos[]>((resolve, reject) => {
      axios
        .get<ITicketsGrupoProcesos[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllGroupsByCategoriaId/${categoriaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllDetailsById(id: number): Promise<ITicketsGrupoProcesos[]> {
    return new Promise<ITicketsGrupoProcesos[]>((resolve, reject) => {
      axios
        .get<ITicketsGrupoProcesos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllDetailsById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DeleteGrupoWithBlock(grupoId: number): Promise<ITicketsGrupoProcesos> {
    return new Promise<ITicketsGrupoProcesos>((resolve, reject) => {
      axios
        .delete<ITicketsGrupoProcesos>(`${import.meta.env.VITE_API_URL}/${this.Url}/DeleteGrupoWithBlock/${grupoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
