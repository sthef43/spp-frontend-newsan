import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import axios from "axios";

export class XXE_WIP_ITF_SERIEService {
    Url = "XXE_WIP_ITF_SERIE";
    public getAllByOp({ orgId, ope }): Promise<IXXE_WIP_ITF_SERIE[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IXXE_WIP_ITF_SERIE[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByOp/${ope}/${orgId}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    public getAllByFechaAndOp(opes): Promise<IXXE_WIP_ITF_SERIE[]> {
        return new Promise((resolve, reject) => {
            axios
                .post<IXXE_WIP_ITF_SERIE[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByFechaAndOp`, opes)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    public getCountByOp(op): Promise<number> {
        console.log(op);

        return new Promise((resolve, reject) => {
            axios
                .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByOp/${op}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    MultiPostRequest(entity: IXXE_WIP_ITF_SERIE[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            axios
                .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPost`, entity)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    public getCountByOpAndTransOk({ op, transOk, orgCode }): Promise<number> {
        return new Promise((resolve, reject) => {
            axios
                .get<number>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetCountByOp/${op}/${transOk}/${orgCode}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    public GetByOp(op): Promise<IXXE_WIP_ITF_SERIE> {
        return new Promise((resolve, reject) => {
            axios
                .get<IXXE_WIP_ITF_SERIE>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByOp/${op}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    public GetByLPNAndSerie({ lpn, serie }): Promise<IXXE_WIP_ITF_SERIE> {
        return new Promise((resolve, reject) => {
            axios
                .get<IXXE_WIP_ITF_SERIE>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLPNAndSerie/${lpn}/${serie}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    public GetBySerie(serie): Promise<IXXE_WIP_ITF_SERIE> {
        return new Promise((resolve, reject) => {
            axios
                .get<IXXE_WIP_ITF_SERIE>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetBySerie/${serie}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    public GetModeloBySerie(numSerie): Promise<string> {
        return new Promise((resolve, reject) => {
            axios
                .get<string>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetModeloBySerie/${numSerie}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    public GetByLPN(lpn): Promise<IXXE_WIP_ITF_SERIE[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IXXE_WIP_ITF_SERIE[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLPN/${lpn}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error)
                });
        });
    }
}