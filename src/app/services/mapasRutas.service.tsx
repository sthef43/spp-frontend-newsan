import { IMapasRutas } from "app/models/IMapasRutas";
import { GenericService } from "./generic.service";
import axios from "axios";

export class MapasRutasService extends GenericService<IMapasRutas> {
  Url = "MapasRutas";
  constructor() {
    super("MapasRutas");
  }

  public getByRutaIdAndEsUltimo(rutaId: number): Promise<IMapasRutas> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMapasRutas>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByRutaIdAndEsUltimo/${rutaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetByRutaIdAndPrimero(rutaId: number): Promise<IMapasRutas> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMapasRutas>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByRutaIdAndPrimero/${rutaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
