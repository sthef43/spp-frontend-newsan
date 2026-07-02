import axios from "axios";
import { ITableroTermoformado } from "app/models/Tableros/ITableroTermoformado";

export class TablerosService {
  url = "Tableros";

  /**
   * Obtiene una lista de objetos TableroTermoformado utilizando los identificadores de línea y puesto de trabajo.
   * @param diarioLineaPuestoId El identificador de línea y puesto de trabajo para los registros diarios.
   * @param consumidoLineaPuestoId El identificador de línea y puesto de trabajo para los registros de consumo.
   * @returns Una lista de objetos TableroTermoformado correspondientes a los identificadores de línea y puesto de trabajo.
   */
  public GetTableroTermoformados(diarioLineaPuestoId:number, consumidoLineaPuestoId:number):Promise<ITableroTermoformado[]> {
    return new Promise<ITableroTermoformado[]>((resolve, rejected) => {
      axios
        .get<ITableroTermoformado[]>(`${import.meta.env.VITE_API_URL}/${this.url}/Termoformado/${diarioLineaPuestoId}/${consumidoLineaPuestoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          rejected(error);
        });
    });
  }
}
