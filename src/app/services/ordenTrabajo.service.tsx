import axios from "axios";
import { IOrdenTrabajo } from "app/models/IOrdenTrabajo";

export class OrdenTrabajoService {
  Url = "OrdenTrabajo";
  public getByModeloAndPanelRequest({ modelo, panel }): Promise<IOrdenTrabajo> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOrdenTrabajo>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByModeloAndPanel/${modelo}/${panel}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
