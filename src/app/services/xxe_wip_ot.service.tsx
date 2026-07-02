import axios from "axios";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import qs from "qs";




export class XXE_WIP_OTService {
  Url = "XXE_WIP_OT";
  public getAllRequest(modelo: string): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllNuevasOp/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllTestRequest(): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllNuevasOpTest`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllOPsForUse(): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllOPsForUse`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByOrgId(orgId: string): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByOrgId/${orgId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllOrgId(): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllOrgId`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getCountByOp(op): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetCountByOp/${op}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListBySemielaborado(semielaborado): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListBySemielaborado/${semielaborado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getList(): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetList`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetQuantityByOp(op): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetQuantityByOp/${op}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetQuantityByOnlyOp(op): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetQuantityByOnlyOp/${op}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByOrganizationCode(organizationCode: string): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByOrganizationCode/${organizationCode}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetCountByOP({ op, orgCode }): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetCountByOP/${op}/${orgCode}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListByOrganizationCodeAndSemielaborado( organizationCode, filters ): Promise<IXXE_WIP_OT[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IXXE_WIP_OT[]>(
          `${process.env.REACT_APP_API_URL}/${this.Url}/GetListByOrganizationCodeAndSemielaborado/${organizationCode}`,
          { 
            params: { filters },
            paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' });
                }
            }
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetFamiliasDisponibles():Promise<string[]>{
    return new Promise ((resolve,reject) => {
      axios
        .get<string[]>(
          `${process.env.REACT_APP_API_URL}/${this.Url}/GetFamiliasDisponibles`,
        ).then(function(response){
          resolve(response.data);
        })
        .catch(function (error){
          reject(error);
        });
    });
  }

  public GetOpsDobladoraByFamilia(familia):Promise<IXXE_WIP_OT[]>{
    return new Promise ((resolve, reject) => {
      axios.get<IXXE_WIP_OT[]>(
          `${process.env.REACT_APP_API_URL}/${this.Url}/GetProduccionFamilia/${familia}`
      ).then(function(response){
        resolve(response.data);
      })
      .catch(function (error){
        reject(error);
      })
    })
  }
}