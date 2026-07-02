import { ILineaProduccion } from "app/models/ILineaProduccion";
import axios from "axios";
import { GenericService } from "./generic.service";

export class LineaProduccionService extends GenericService<ILineaProduccion> {
  Url = "LineaProduccion";
  constructor() {
    super("LineaProduccion");
  }
  public getLineaByPlantIdRequest(id: number): Promise<ILineaProduccion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccion[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getLineaByPlantId/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getLineaByPlantaIdAndProductoId({ plantaId, productoId }): Promise<ILineaProduccion[]> {
    return new Promise((resolve, rejetc) => {
      axios
        .get<ILineaProduccion[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetLineaByPlantIdAndProductId/${plantaId}/${productoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          rejetc(error);
        });
    });
  }

  public GetOnlyLinesMountingByProductIdAndPlantId({ plantaId, productoId }): Promise<ILineaProduccion[]> {
    return new Promise((resolve, rejetc) => {
      axios
        .get<ILineaProduccion[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetOnlyLinesMountingByProductIdAndPlantId/${plantaId}/${productoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          rejetc(error);
        });
    });
  }

  public getAllByProductId(productId: number): Promise<ILineaProduccion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccion[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductId/${productId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetByIdentificadorLinea(identificadorLinea: any): Promise<ILineaProduccion> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccion>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByIdentificadorLinea/${identificadorLinea}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getByPlantIdRequest(plantId: number): Promise<ILineaProduccion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccion[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getByPlantId/${plantId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllLinesWithOnlyAirByPlantaId(plantId: number): Promise<ILineaProduccion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccion[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllLinesWithOnlyAirByPlantaId/${plantId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
