import { ILineasRechazoHabilitadas } from "app/models/ILineasRechazoHablitadas";
import { GenericService } from "./generic.service";
import axios from "axios";

export class LineasRechazoHabilitadasService extends GenericService<ILineasRechazoHabilitadas> {
  Url = "LineasRechazoHabilitadas";
  constructor() {
    super("LineasRechazoHabilitadas");
  }
  public async GetAllLineasByFilters(
    flagCargadora: boolean,
    flagRunTest: boolean,
    flagProTrace: boolean,
    identificadorId: number
  ): Promise<ILineasRechazoHabilitadas> {
    return await new Promise((resolve, reject) => {
      axios
        .get<ILineasRechazoHabilitadas>(
          `${process.env.REACT_APP_API_URL}/${this.url}/GetLineasByFilters/${flagCargadora}/${flagRunTest}/${flagProTrace}/${identificadorId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
}
