import axios from "axios";
import { IIDU1200ensayos } from "app/models/IIDU1200ensayos";

export class IDU1200ensayosService {
  Url = "IDU1200ensayos";
  public getAllRequest(): Promise<IIDU1200ensayos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIDU1200ensayos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByCodigo(codigo: string): Promise<IIDU1200ensayos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIDU1200ensayos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCodigo/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  //public async Task<List<IDU1200ensayos>> GetLastsTen(string PAB)
  public getLastsTen(PAB: string): Promise<IIDU1200ensayos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIDU1200ensayos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLastsTen/${PAB}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
 //public async Task<List<IDU1200ensayos>> GetLastByFamilia(string familia)
  public getLastByFamilia(familia: string): Promise<IIDU1200ensayos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIDU1200ensayos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLastByFamilia/${familia}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
