import axios from "axios";
import { ICalidadDocument } from "app/models/ICalidadDocument";
import { GenericService } from "app/services/generic.service";

export class CalidadDocumentService extends GenericService<ICalidadDocument> {
  Url = "CalidadDocument";
  constructor() {
    super("CalidadDocument");
  }
  public GetByPlPrFaMoSIA({
    plantId,
    productoId,
    familiaId,
    modeloId,
    semielaboradoIAId
  }): Promise<ICalidadDocument[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICalidadDocument[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.url
          }/GetByPlPrFaMoSIA/${plantId}/${productoId}/${familiaId}/${modeloId}/${semielaboradoIAId}`
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
