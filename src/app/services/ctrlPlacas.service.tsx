import axios from "axios";
import { GenericService } from "./generic.service";
import { ICtrlPlacas } from "app/models/ICtrlPlacas";

export class CtrlPlacasService extends GenericService<ICtrlPlacas> {
  // export class DobPlanoService {
  Url = "CtrlPlacas";
  constructor() {
    super("CtrlPlacas");
  }
  public GetListByPlantIdLineaId({ plantId, lineaId, fechaDesde, fechaHasta }): Promise<ICtrlPlacas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICtrlPlacas[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlantIdLineaId/${plantId}/${lineaId}/${fechaDesde}/${fechaHasta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }


  public GetAmountByHour({lineaProduccionId, fecha , desde, hasta}):Promise<Array<{lineaProduccionId:number, hora:number, cantidad:number}>>
  { 
    return new Promise((resolve, reject) => {
      axios
        .get<Array<{lineaProduccionId:number, hora:number, cantidad:number}>>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAmountByHour/${lineaProduccionId}/${fecha}/${desde}/${hasta}`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error))
    })
  }

  
  public GetAmountByDates({ lineaProduccionId, fechaDesde, fechaHasta, desde, hasta }): Promise<Array<{ lineaProduccionId: number, fecha: string, cantidad: number }>> {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<{ lineaProduccionId: number, fecha: string, cantidad: number }>>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAmountByDates/${lineaProduccionId}/${fechaDesde}/${fechaHasta}/${desde}/${hasta}`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error))
    })
  }
  
  public GetListByCtrlPlacasHallazgosId(ctrlPlacasHallazgosId: number): Promise<ICtrlPlacas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICtrlPlacas[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByCtrlPlacasHallazgosId/${ctrlPlacasHallazgosId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
