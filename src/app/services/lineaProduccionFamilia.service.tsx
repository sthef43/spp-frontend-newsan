import { ILineaProduccionFamilia } from "app/models/ILineaProduccionFamilia";
import axios from "axios";
import { GenericService } from "./generic.service";

export class LineaProduccionFamiliaService extends GenericService<ILineaProduccionFamilia> {
  Url = "LineaProduccionFamilia";
  constructor() {
    super("LineaProduccionFamilia");
  }

  public getAllByLineaId(lineaId: number): Promise<ILineaProduccionFamilia[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccionFamilia[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByLineaId/${lineaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getByLineaAndFamilia({ linea, familia }): Promise<ILineaProduccionFamilia> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccionFamilia>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/getByLineaAndFamilia/${linea}/${familia}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetSemielaboradoActivoByLinea(linea: string): Promise<ILineaProduccionFamilia> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccionFamilia>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/getSemielaboradoActivoByLinea/${linea}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllFamiliesByLineaAndProveedorId(lineaId: number, proveedorId: number): Promise<ILineaProduccionFamilia[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILineaProduccionFamilia[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllFamiliesByLineaAndProveedorId/${lineaId}/${proveedorId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public ActivarSemielaborado(codigoInicio: string, familiaId: number, semielaboradoIAId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/ActivarSemielaborado/${codigoInicio}/${familiaId}/${semielaboradoIAId}`
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
