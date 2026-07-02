import axios from "axios";

export interface IRechazoMultiple {
  id: number;
  idRechazo: number;
  componente: string;
  subComponente: string;
  defecto: string;
}

export class RechazoMultipleService {
  Url = "RechazoMultiple";

  public async GetByDay(
    day: number,
    month: number,
    year: number,
    idLinea: number,
    codigoRechazo: number
  ): Promise<IRechazoMultiple[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazoMultiple[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByDay/${day}/${month}/${year}/${codigoRechazo}/${idLinea}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
}
