import { IAppUser } from "app/models/IAppUser";
import { IAuthRequest } from "app/models/IAuthRequest";
import { IAuthResponse } from "app/models/IAuthResponse";
import axios from "axios";

import { GenericService } from "./generic.service";

export class AppUserService extends GenericService<IAppUser> {
  Url = "Users";
  constructor() {
    super("Users");
  }

  public LoginUser(model: IAuthRequest): Promise<IAuthResponse> {
    return new Promise((resolve, reject) => {
      axios
        .post<IAuthRequest>(`${import.meta.env.VITE_API_URL}/${this.Url}/Authenticate`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getInfoUserById(model: number): Promise<IAppUser> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAppUser>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUserById/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getInfoUserByDni(model: number): Promise<IAppUser> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAppUser>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUserByDni/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetUserByOperatorId(model: number): Promise<IAppUser> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAppUser>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetUserByOperatorId/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public registerRequest(entity: IAppUser): Promise<IAppUser> {
    return new Promise((resolve, reject) => {
      axios
        .post<IAppUser>(`${import.meta.env.VITE_API_URL}/${this.url}/Register`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllUsers(): Promise<IAppUser[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAppUser[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllUsers`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public resetearContrasenia(appUserId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/ResetearContrasenia/${appUserId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public nuevaContrasenia(newPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/Pass`, { password: newPassword })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
