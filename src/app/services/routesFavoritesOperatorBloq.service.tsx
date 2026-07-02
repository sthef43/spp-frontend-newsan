import axios from "axios";
import { IRoutesFavoritesOperatorBloq } from "../models/IRoutesFavoritesOperatorBloq";
import { IRoutes } from "../models/IRoutes";
import { GenericService } from "../services/generic.service";

export class RoutesFavoritesOperatorBloqService extends GenericService<IRoutesFavoritesOperatorBloq> {
  Url = "RoutesFavoritesOperatorBloq";
  constructor() {
    super("RoutesFavoritesOperatorBloq");
  }

  public async GetAllRoutesByOperatorId(operatorId: number): Promise<IRoutes[]> {
    return new Promise<IRoutes[]>((resolve, reject) => {
      axios
        .get<IRoutes[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRoutesByOperatorId/${operatorId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async SearchAndDeleteFavorite(operatorId: number, routeId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchAndDeleteFavorite/${operatorId}/${routeId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async ChangeRoutePriority(route: IRoutes): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/ChangeRoutePriority/`, route)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
