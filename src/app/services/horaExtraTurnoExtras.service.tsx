import { IHoraExtraTurnoExtras } from "app/models/IHoraExtraTurnoExtras";
import { GenericService } from "./generic.service";
import axios from "axios";

export class HoraExtraTurnoExtrasService extends GenericService<IHoraExtraTurnoExtras> {
  Url = "HoraExtraTurnoExtras";
  constructor() {
    super("HoraExtraTurnoExtras");
  }
  public getByDateAndProductId(
    productoId: number,
    desdeFecha: string,
    hastaFecha: string
  ): Promise<IHoraExtraTurnoExtras[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IHoraExtraTurnoExtras[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByDateAndProductId/${productoId}/${desdeFecha}/${hastaFecha}`
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
