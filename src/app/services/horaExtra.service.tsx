import axios from "axios";
import { GenericService } from "./generic.service";
import { IHoraExtra } from "app/models/IHoraExtra";

export class HoraExtraService extends GenericService<IHoraExtra> {
  Url = "HoraExtra";
  constructor() {
    super("HoraExtra");
  }
  public getByDateAndProductId(productoId: number, desdeFecha: string, hastaFecha: string): Promise<IHoraExtra[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IHoraExtra[]>(
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
