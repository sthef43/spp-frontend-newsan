import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";
import { GenericService } from "./generic.service";
import axios from "axios";

export class IntRemitoPadreService extends GenericService<IIntRemitoPadre> {
  Url = "IntRemitoPadre";
  constructor() {
    super("IntRemitoPadre");
  }
  public GetAllByEstadoOrigenDestino({intEstadoId, plantOrigenId, plantDestinoId}): Promise<IIntRemitoPadre[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIntRemitoPadre[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByEstadoOrigenDestino/${intEstadoId}/${plantOrigenId}/${plantDestinoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByPatenteEstado({patente, intEstadoId}): Promise<IIntRemitoPadre[]> {
    return new Promise((resolve, reject) => {
      axios
      .get<IIntRemitoPadre[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByPatenteEstado/${patente}/${intEstadoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
      });
    }
    public GetByIdRemitoPadre(idRemitoPadre: number): Promise<IIntRemitoPadre[]> {
      return new Promise((resolve, reject) => {
        axios
          .get<IIntRemitoPadre[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByIdRemitoPadre/${idRemitoPadre}`)
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    }
  }
  