import { IBinariosIdentificadores } from "app/models/IBinariosIdentificadores";
import { GenericService } from "./generic.service";
import axios from "axios";

export class BinariosIdentificadoresService extends GenericService<IBinariosIdentificadores> {
  Url = "BinariosIdentificadores";
  constructor() {
    super("BinariosIdentificadores");
  }
  public GetAllNotMapped(puestoLineaSeleccionada:number) {
    return new Promise<IBinariosIdentificadores[]>((resolve, rejected) => {
      axios
        .get<IBinariosIdentificadores[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllNotMapped/${puestoLineaSeleccionada}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          rejected(error);
        });
    });
  }
}
