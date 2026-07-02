import { ISemielaboradoIA } from "app/models/ISemielaboradoIA";
import axios from "axios";
import { GenericService } from "./generic.service";

export class SemielaboradoIAService extends GenericService<ISemielaboradoIA> {
  constructor() {
    super("SemielaboradoIA");
  }
  url = "SemielaboradoIA";

  getByFamiliaAndTipoSemielaborado({ familia, tipo }): Promise<ISemielaboradoIA> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaboradoIA>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetByFamiliaAndTipoSemielaborado/${familia}/${tipo}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getByFamiliaId(familiaId): Promise<ISemielaboradoIA[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaboradoIA[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getByFamiliaId/${familiaId}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getByValor(valor): Promise<ISemielaboradoIA> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaboradoIA>(`${import.meta.env.VITE_API_URL}/${this.url}/getByValor/${valor}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  post(valor): Promise<ISemielaboradoIA> {
    return new Promise((resolve, reject) => {
      axios
        .post<ISemielaboradoIA>(`${import.meta.env.VITE_API_URL}/${this.url}/PostAux`, valor)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getByFamiliaRequest(familia): Promise<ISemielaboradoIA> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaboradoIA>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByFamilia/${familia}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetByFamAndTSemiRequest({ familia, tipo }): Promise<ISemielaboradoIA> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISemielaboradoIA>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetByFamiliaAndTipoSemielaborado/${familia}/${tipo}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
