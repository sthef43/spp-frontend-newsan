import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsCategoriasRolBloque } from "app/features/tickets/models/ITicketsCategoriasRolBloque";

export class TicketsCategoriaRolBloque extends GenericService<ITicketsCategoriasRolBloque> {
  Url = "TicketsCategoriaRolBloque";
  constructor() {
    super("TicketsCategoriaRolBloque");
  }

  public async DeleteBloqueByRolAndCategoriaId(
    categoriaId: number,
    rolId: number
  ): Promise<ITicketsCategoriasRolBloque> {
    return new Promise<ITicketsCategoriasRolBloque>((resolve, reject) => {
      axios
        .delete<ITicketsCategoriasRolBloque>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/DeleteBloqueByRolAndCategoriaId/${categoriaId}/${rolId}`
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
