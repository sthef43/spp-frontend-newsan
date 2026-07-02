import { IFamiliaRutas } from "app/models/IFamiliaRutas";
import axios from "axios";
import { GenericService } from "./generic.service";

export class FamiliaRutasService extends GenericService<IFamiliaRutas> {
  Url = "FamiliaRutas";
  constructor() {
    super("FamiliaRutas");
  }
  public getAllRutaByFamiliaId(familiaId: number): Promise<IFamiliaRutas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IFamiliaRutas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRutaByFamiliaId/${familiaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByFilters(object: any): Promise<IFamiliaRutas[]> {
    const { familiaId, lineaId } = object;
    return new Promise((resolve, reject) => {
      axios
        .get<IFamiliaRutas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFilters/${familiaId}/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
