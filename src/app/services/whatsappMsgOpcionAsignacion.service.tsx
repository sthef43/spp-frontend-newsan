import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IWhatsappMsgOpcionAsignacion } from "../models/IWhatsappMsgOpcionAsignacion";

export class WhatsappMsgOpcionAsignacionService extends GenericService<IWhatsappMsgOpcionAsignacion> {
    Url = "WhatsappMsgOpcionAsignacion";
    constructor() {
        super("WhatsappMsgOpcionAsignacion");
    }

    public async GetOptionsByPlantId(plantId: number): Promise<IWhatsappMsgOpcionAsignacion> {
        return new Promise<IWhatsappMsgOpcionAsignacion>((resolve, reject) => {
            axios
                .get<IWhatsappMsgOpcionAsignacion>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetOptionsByPlantId/${plantId}`)
                .then((response) => { resolve(response.data) })
                .catch((error) => { reject(error) })
        })
    }
}