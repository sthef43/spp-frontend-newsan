import { IRenacerReparaciones } from "app/models/IRenacerReparaciones";
import axios from "axios";
import { GenericService } from "./generic.service";

export class RenacerReparacionesService extends GenericService<IRenacerReparaciones> {
    Url = "RenacerReparaciones"
    constructor() {
        super("RenacerReparaciones")
    }

    public GetReparacionesGroupByPosicion(): Promise<IRenacerReparaciones[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IRenacerReparaciones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetReparacionesGroupByPosicion`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
}