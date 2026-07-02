import { IRecepcionLpn } from "app/models/IRecepcionLpn";
import axios from "axios";
import { GenericService } from "./generic.service";

export class RecepcionLpnService extends GenericService<IRecepcionLpn> {
    Url = "RecepcionLpn"
    constructor() {
        super("RecepcionLpn")
    }

    public async GetRecepcionByLpn(codigoLpn: string): Promise<IRecepcionLpn> {
        return new Promise((resolve, reject) => {
            axios
                .get<IRecepcionLpn>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetRecepcionByLpn/${codigoLpn}`)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err))
        })
    }

    public async SearchRecepcionByLpn(codigoLpn: string): Promise<IRecepcionLpn> {
        return new Promise((resolve, reject) => {
            axios
                .get<IRecepcionLpn>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchRecepcionByLpn/${codigoLpn}`)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err))
        })
    }

    public async GetAllByRecepcionado(): Promise<IRecepcionLpn[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IRecepcionLpn[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByRecepcionado`)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err))
        })
    }
}