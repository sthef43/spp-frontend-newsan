import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsGrupoProcesosBloque } from "app/features/tickets/models/ITicketsGrupoProcesosBloque";

export class TicketsGrupoProcesosBloqueService extends GenericService<ITicketsGrupoProcesosBloque> {
  Url = "TicketsGrupoProcesosBloque";
  constructor() {
    super("TicketsGrupoProcesosBloque");
  }

  public async DeleteBloqByItemAndGrupoId(itemId: number, grupoId: number): Promise<ITicketsGrupoProcesosBloque[]> {
    return new Promise<ITicketsGrupoProcesosBloque[]>((resolve, reject) => {
      axios
        .delete<ITicketsGrupoProcesosBloque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/DeleteBloqByItemAndGrupoId/${itemId}/${grupoId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetBloqueByGrupoIdAndItemId(itemId: number, grupoId: number): Promise<ITicketsGrupoProcesosBloque> {
    return new Promise<ITicketsGrupoProcesosBloque>((resolve, reject) => {
      axios
        .get<ITicketsGrupoProcesosBloque>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetBloqueByGrupoIdAndItemId/${itemId}/${grupoId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async PutTicketsGrupoProcesosBloque(
    bloque: ITicketsGrupoProcesosBloque
  ): Promise<ITicketsGrupoProcesosBloque> {
    return new Promise<ITicketsGrupoProcesosBloque>((resolve, reject) => {
      axios
        .put<ITicketsGrupoProcesosBloque>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/PutTicketsGrupoProcesosBloque`,
          bloque
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllWithGrupoId(groupId: number): Promise<ITicketsGrupoProcesosBloque[]> {
    return new Promise<ITicketsGrupoProcesosBloque[]>((resolve, reject) => {
      axios
        .get<ITicketsGrupoProcesosBloque[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWithGrupoId/${groupId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
