import { IRechazoMain } from "app/models/IRechazoMain";
import axios from "axios";

export class RechazoMainService {
  url = "RechazoMain";

  public getInforme({ fechaDesde, fechaHasta, lineaId, turno }): Promise<IRechazoMain[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazoMain[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetInforme/${fechaDesde}/${fechaHasta}/${lineaId}/${turno}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
}
