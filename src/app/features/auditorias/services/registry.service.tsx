import { IPagedPaginator } from "app/models/IPagedPaginator";
import { IRegistry } from "app/models/IRegistry";
import { GenericService } from "app/services/generic.service";
import axios from "axios";

export class RegistryService extends GenericService<IRegistry> {
  Url = "Registry";
  constructor() {
    super("Registry");
  }
  public getbyRolId(rolId: number): Promise<IRegistry[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRegistry[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getbyRolId/${rolId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getPaginatedbyRolId(
    pag: number,
    count: number,
    rolId: number,
    search: string
  ): Promise<IPagedPaginator<IRegistry[]>> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPagedPaginator<IRegistry[]>>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPaginatedByRol/${pag}/${count}/${rolId}?search=${search}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
