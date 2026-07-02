import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import axios from "axios";
import { GenericService } from "./generic.service";
import { ParadasPorSectorDTO } from "app/models/DTO/ParadasPorSectorDTO";

export class ParadasDeLineaService extends GenericService<IParadasDeLinea> {
  Url = "ParadasDeLinea";
  constructor() {
    super("ParadasDeLinea");
  }
  public GetByFilters({ fechaInicio, lineaId, turnoId, fechaFin }): Promise<IParadasDeLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParadasDeLinea[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByFilters/${fechaInicio}/${fechaFin}/${lineaId}/${turnoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByPlantId({ fechaInicio, plantId, turnoId, fechaFin }): Promise<IParadasDeLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParadasDeLinea[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPlantId/${fechaInicio}/${fechaFin}/${plantId}/${turnoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetParadaByNP({ fechaInicio, fechaFin, nombreL }): Promise<IParadasDeLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParadasDeLinea[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetParadaByNP/${fechaInicio}/${fechaFin}/${nombreL}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetParadaByNPyT({ fechaInicio, fechaFin, nombreL, turno }): Promise<IParadasDeLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParadasDeLinea[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetParadaByNPyT/${fechaInicio}/${fechaFin}/${nombreL}/${turno}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetByFiltersAndDiscontinuo({ fecha, lineaId, turnoId, discontinuo }): Promise<IParadasDeLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParadasDeLinea[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetByFiltersAndDiscontinuo/${fecha}/${lineaId}/${turnoId}/${discontinuo}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetTotalParadasDeLineaByDate({fechaInicio, fechaFin,plantaId, productoId}): Promise<ParadasPorSectorDTO[]>{
    return new Promise((resolve, reject) => {
      axios
      .get<ParadasPorSectorDTO[]>(`${process.env.REACT_APP_API_URL}/${this.Url}/GetTotalParadasDeLineaByDate/${fechaInicio}/${fechaFin}/${plantaId}/${productoId}`)
      .then(function(response){
        resolve(response.data);
      })
      .catch(function(error){
        reject(error);
      })
    })
  }
}
