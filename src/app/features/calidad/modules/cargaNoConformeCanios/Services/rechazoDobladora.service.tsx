/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericService } from "app/services/generic.service";
import { IRechazoDobladora } from "../Models/IRechazoDobladora";
import axios from "axios";

/**
 * Servicio encargado de la comunicación con el backend para la entidad RechazoDobladora.
 * Hereda de GenericService para funcionalidades básicas.
 */
export class RechazoDobladoraService extends GenericService<IRechazoDobladora> {
  Url = "RechazoDobladora";
  constructor() {
    super("RechazoDobladora");
  }

  /**
   * Envía un nuevo registro de rechazo al servidor, incluyendo opcionalmente una imagen.
   * @param entidad Objeto con los datos del rechazo
   * @param file Archivo de imagen adjunto (opcional)
   * @returns Promesa con valor booleano indicando éxito
   */
  public async PostNewRegister(entidad: IRechazoDobladora, file?: any[]): Promise<IRechazoDobladora> {
    const formData = new FormData();
    formData.append("contencion", entidad.accionContencion);
    formData.append("correctiva", entidad.accionCorrectiva);
    formData.append("multiplesCausas", entidad.multiplesCausas);
    formData.append("multiplesDescripcionRechazo", entidad.multiplesDescripcionRechazo);
    formData.append("descripcionId", entidad.descripcionRechazoId.toString());
    formData.append("lpn", entidad.lpn);
    formData.append("cantidad", entidad.cantidadRechazada.toString());
    formData.append("causaRaizId", entidad.causaRaizId.toString());
    formData.append("operatorId", entidad.operatorId.toString());
    formData.append("codigoQr", entidad.codigoQr);
    formData.append("dobladoraId", entidad.dobladoraId.toString());
    formData.append("emailGroupId", entidad.emailGroupId.toString());
    formData.append("lineaId", entidad.lineaId.toString());
    formData.append("articulo", entidad.articulo);
    formData.append("descripcionCanio", entidad.descripcionCanio);
    formData.append("familia", entidad.familia);
    formData.append("descripcionRechazoOperador", entidad.descripcionRechazoOperador);
    if (file) {
      file.forEach((elementos) => {
        formData.append("archivo", elementos.file);
      });
    }
    return new Promise<IRechazoDobladora>((resolve, reject) => {
      axios
        .post<IRechazoDobladora>(`${import.meta.env.VITE_API_URL}/${this.Url}/PostNewRegister`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Obtiene el listado de rechazos filtrados por un rango de fechas.
   * @param fechaDesde Fecha de inicio (string)
   * @param fechaHasta Fecha de fin (string)
   * @returns Lista de rechazos encontrados
   */
  public async GetAllRejectionByDates(fechaDesde: string, fechaHasta: string): Promise<IRechazoDobladora[]> {
    return new Promise<IRechazoDobladora[]>((resolve, reject) => {
      axios
        .get<IRechazoDobladora[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRejectionByDates/${fechaDesde}/${fechaHasta}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Obtiene un rechazo específico por su ID.
   * @param id Identificador del rechazo
   * @returns Rechazo encontrado
   */
  public async GetRejectionById(id: number): Promise<IRechazoDobladora> {
    return new Promise<IRechazoDobladora>((resolve, reject) => {
      axios
        .get<IRechazoDobladora>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetRejectionById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
