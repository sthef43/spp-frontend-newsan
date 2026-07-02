import axios from "axios";
import { GenericService } from "./generic.service";
import { IDotaFamiliaLineaProduccion } from "app/models/IDotaFamiliaLineaProduccion";

export class DotaFamiliaLineaProduccionService extends GenericService<IDotaFamiliaLineaProduccion> {
  url = "DotaFamiliaLineaProduccion";
  constructor() {
    super("DotaFamiliaLineaProduccion");
  }

  public GetByFamiliaAndLinea({ dotaFamiliaId, lineaProduccionId }): Promise<IDotaFamiliaLineaProduccion> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDotaFamiliaLineaProduccion>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetByFamiliaAndLinea/${dotaFamiliaId}/${lineaProduccionId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public UpdateVigenteByDotaFamilineaLineaProduccionId(dotaFamiliaLineaProduccionId): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.url}/UpdateVigenteByDotaFamilineaLineaProduccionId/${dotaFamiliaLineaProduccionId}`
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
