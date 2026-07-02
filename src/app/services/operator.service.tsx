import { IOperator } from "app/models/IOperator";
import { GenericService } from "./generic.service";
import axios from "axios";

export class OperatorService extends GenericService<IOperator> {
  Url = "Operator";
  constructor() {
    super("Operator");
  }
  public GetInfoByDni(dni: number): Promise<IOperator> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOperator>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUserByDni/${dni}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListOperator(): Promise<IOperator[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOperator[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListOperator`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListOperatorByRol(rolId: number): Promise<IOperator[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOperator[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListOperatorByRol/${rolId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
