import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IAutomotrizJig } from "../Interfaces/IAutomotrizJig";
import { InformePlacasAutomotrizSP } from "../Interfaces/InformePlacasAutomotrizSP";

export class AutomotrizJigService extends GenericService<IAutomotrizJig> {
  Url = "AutomotrizJig";
  constructor() {
    super("AutomotrizJig");
  }

  public async GetPlatesByLineAndFromAndUntil(
    fechaDesde: string,
    fechaHasta: string,
    lineaId: number,
    nameModelo: string
  ): Promise<InformePlacasAutomotrizSP[]> {
    return new Promise<InformePlacasAutomotrizSP[]>((resolve, reject) => {
      axios
        .get<InformePlacasAutomotrizSP[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetPlatesByLineAndFromAndUntil/${fechaDesde}/${fechaHasta}/${lineaId}/${nameModelo}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public GetTestsByDates(fechaDesde:string, fechaHasta:string): Promise<IAutomotrizJig[]>{
    return new Promise<IAutomotrizJig[]>((resolve, reject) => {
      axios.
      get<IAutomotrizJig[]>(
        `${process.env.REACT_APP_API_URL}/${this.Url}/GetTestsByDates/${fechaDesde}/${fechaHasta}`
      )
      .then((response) =>{
        resolve(response.data);
      })
      .catch((error) => {
        reject(error)
      })
    })
  }
}
