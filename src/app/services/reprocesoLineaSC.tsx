import axios from "axios";
import { IReprocesoLineaSC } from "../models/IReprocesoLineaSC";
import { IReprocesoScConTraza } from "../models/IReprocesoScConTraza";

export class ReprocesoLineaScService {
    Url = "ReprocesoLineaSc";

    public getAllItemsWithDates(fechaDesde: string, fechaHasta: string): Promise<IReprocesoLineaSC[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IReprocesoLineaSC[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllItemsWithDates/${fechaDesde}/${fechaHasta}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error)
                });
        });
    }
    public getReprocesosWithTrazaByDate(fechaDesde: string, fechaHasta: string): Promise<IReprocesoScConTraza[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IReprocesoScConTraza[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetReprocesosWithTrazaByDate/${fechaDesde}/${fechaHasta}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error)
                });
        });
    }
}