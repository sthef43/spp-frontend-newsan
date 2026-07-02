import { ResumenMensualRechazos } from "app/models/DTO/ResumenMensualRechazosdto";
import { IInformeRechazoMensual } from "app/models/IInformeRechazoMensual";
import { InformeRechazos } from "app/models/InformeRechazos";
import { IRechazo } from "app/models/IRechazo";
import axios from "axios";

export class RechazoService {
  Url = "Rechazo";

  public async GetRechazoByBarcode(barcode: string): Promise<IRechazo> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazo>(`${import.meta.env.VITE_API_URL}/${this.Url}/${barcode}/`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public async GetAllRechazoByCodigo(barcode: string): Promise<IRechazo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRechazoByCodigo/${barcode}/`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  public GetInformeRehazos({ fechaDesde, fechaHasta, lineaId }): Promise<InformeRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<InformeRechazos[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetInformeRehazos/${fechaDesde}/${fechaHasta}/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetInformeRehazosAgrupados({ fechaDesde, fechaHasta, lineaId }): Promise<InformeRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<InformeRechazos[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetInformeRehazosAgrupados/${fechaDesde}/${fechaHasta}/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByFecha({ fechaDesde, fechaHasta, lineaId, turno }): Promise<IRechazo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazo[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFecha/${fechaDesde}/${fechaHasta}/${lineaId}/${turno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetRechazosByDateAndLineaId({ fechaDesde, fechaHasta, lineaId, turno }): Promise<IRechazo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazo[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetRechazosByDateAndLineaId/${fechaDesde}/${fechaHasta}/${lineaId}/${turno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetKPI({ fechaDesde, fechaHasta, lineaId, turno }): Promise<IRechazo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazo[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetKPI/${fechaDesde}/${fechaHasta}/${lineaId}/${turno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public async GetAllByLineaAndFechaAndDesdeHasta(lineaId: number, fecha: string, horaId: number): Promise<IRechazo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazo[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/getAllByLineaAndFechaAndDesdeHasta/${lineaId}/${fecha}/${horaId}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public GetInformeMensual(
    month: number,
    year: number,
    lineaId: number,
    turno: string
  ): Promise<ResumenMensualRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetInformeMensual/${month}/${year}/${lineaId}/${turno}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  public GetAllByFechaLineaHoraGroup({
    fecha,
    idLinea,
    horaDesde,
    horaHasta,
    conRechazoMain
  }): Promise<ResumenMensualRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllByFechaLineaHoraGroup/${fecha}/${idLinea}/${horaDesde}/${horaHasta}/${conRechazoMain}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  public getAllByLineaIdFechaAndPuesto({
    fecha,
    idLinea,
    horaDesde,
    horaHasta,
    puestoNombre
  }): Promise<ResumenMensualRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllByLineaIdFechaAndPuesto/${fecha}/${idLinea}/${horaDesde}/${horaHasta}/${puestoNombre}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  public getAllByLineaIdFechaAndPuestosNombre({
    fecha,
    idLinea,
    horaDesde,
    horaHasta,
    puestoNombre,
    puestoNombre2
  }): Promise<ResumenMensualRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllByLineaIdFechaAndPuestos/${fecha}/${idLinea}/${horaDesde}/${horaHasta}/${puestoNombre}/${puestoNombre2}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  public getRechazosByNroOP(numOp: string): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetRechazosByNroOP/${numOp}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public GetRechazoByHour({ fechaDesde, fechaHasta, idLinea, desde, hasta }) {
    return new Promise((resolve, reject) => {
      axios
        .get<any[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetRechazoByHour/${fechaDesde}/${fechaHasta}/${idLinea}/${desde}/${hasta}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public GetRechazoByFamilia(
    idLinea: number,
    desde: number,
    hasta: number
  ): Promise<Array<{ fecha: string; familia: string; puesto: string; total: number; hora: number }>> {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<{ fecha: string; familia: string; puesto: string; total: number; hora: number }>>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetRechazoByFamilia/${idLinea}/${desde}/${hasta}`
        )
        .then((r) => {
          resolve(r.data);
        })
        .catch((e) => reject(e));
    });
  }

  public multiPost(entity: IRechazo[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/multiPost`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public deleteRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/?id=${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async MultiDelete(barcode: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiDelete/${barcode}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DeleteMultiBarcode(barcode: string[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/DeleteMultiBarcode`, barcode)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async AddRechazo(entity: IRechazo): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/AddRechazo`, entity)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public ActualizarRequest({ barcode, estado }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/ActualizarRequest/${barcode}/${estado}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public GetByFechaLineaIdRequest({ fechaDesde, fechaHasta, lineaId }): Promise<IRechazo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazo[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByFechaLineaId/${fechaDesde}/${fechaHasta}/${lineaId}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public GetAllDateWithDatesAndLinea(año, mes, turno, lineaIdAux): Promise<IInformeRechazoMensual[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInformeRechazoMensual[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllDateWithDatesAndLinea/${año}/${mes}/${turno}/${lineaIdAux}`
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public async GetListRejectionByDrain(desde: string, hasta: string): Promise<IRechazo[]> {
    return new Promise<IRechazo[]>((resolve, reject) => {
      axios
        .get<IRechazo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListRejectionByDrain/${desde}/${hasta}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllRejectionByDrain(): Promise<IRechazo[]> {
    return new Promise<IRechazo[]>((resolve, reject) => {
      axios
        .get<IRechazo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRejectionByDrain`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
