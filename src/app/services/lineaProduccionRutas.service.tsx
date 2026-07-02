import { ILineaProduccionRutas } from "app/models/ILineaProduccionRutas";
import axios from "axios";
import { GenericService } from "./generic.service";

export class LineaProduccionRutasService extends GenericService<ILineaProduccionRutas> {
  Url = "LineaProduccionRutas";
  constructor() {
    super("LineaProduccionRutas");
  }
  public getAllRutaByLineaId(lineaId: number): Promise<ILineaProduccionRutas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccionRutas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRutaByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getRutaActiva(lineaId: number): Promise<ILineaProduccionRutas> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccionRutas>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetRutaActiva/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getRutaActivaByLineaId(lineaId: number): Promise<ILineaProduccionRutas> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccionRutas>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetRutaActivaByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
