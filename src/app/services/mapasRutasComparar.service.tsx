import { IMapasRutasComparar } from "app/models/IRutasCamposComparar";
import axios from "axios";
import { GenericService } from "./generic.service";

export class MapasRutasCompararService extends GenericService<IMapasRutasComparar> {
  Url = "MapasRutasComparar";
  constructor() {
    super("MapasRutasComparar");
  }
  getAllByCampoId(id: number): Promise<IMapasRutasComparar[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMapasRutasComparar[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCampoId/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
