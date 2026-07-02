import { IMapasRutasCampos } from "app/models/IMapasRutasCampos";
import axios from "axios";
import { GenericService } from "./generic.service";

export class MapasRutasCamposService extends GenericService<IMapasRutasCampos> {
  Url = "MapasRutasCampos";
  constructor() {
    super("MapasRutasCampos");
  }

  public getListByMapaRutaId(mapaRutaId: number): Promise<IMapasRutasCampos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMapasRutasCampos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByMapaRutaId/${mapaRutaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
