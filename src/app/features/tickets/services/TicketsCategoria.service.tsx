import { IRol } from "app/models";
import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsCategoria } from "app/features/tickets/models/ITicketsCategorias";

export class TicketsCategoriaService extends GenericService<ITicketsCategoria> {
  Url = "TicketsCategoria";
  constructor() {
    super("TicketsCategoria");
  }

  public async GetAllRolsWithCategorieId(categoriaId: number): Promise<ITicketsCategoria> {
    return new Promise<ITicketsCategoria>((resolve, reject) => {
      axios
        .get<ITicketsCategoria>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRolsWithCategorieId/${categoriaId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllRolWithoutCategoria(categoriaId: number): Promise<IRol[]> {
    return new Promise<IRol[]>((resolve, reject) => {
      axios
        .get<IRol[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRolWithoutCategoria/${categoriaId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DeleteCategoriaWithBlocks(categoriaId: number): Promise<ITicketsCategoria> {
    return new Promise<ITicketsCategoria>((resolve, reject) => {
      axios
        .delete<ITicketsCategoria>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/DeleteCategoriaWithBlocks/${categoriaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllCategoriesByPlantId(plantaId: number): Promise<ITicketsCategoria[]> {
    return new Promise<ITicketsCategoria[]>((resolve, reject) => {
      axios
        .get<ITicketsCategoria[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllCategoriesByPlantId/${plantaId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
