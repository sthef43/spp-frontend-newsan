import axios from "axios";
import { IXXE_WIP_ITF_SERIE_History } from "../models/IXXE_WIP_ITF_SERIE_History";

export class XXE_WIP_ITF_SERIE_HistoryService{
    Url = "XXE_WIP_ITF_SERIE_History";
    
    public async GetByLpn(lpn: string): Promise<IXXE_WIP_ITF_SERIE_History[]> {
        return new Promise<IXXE_WIP_ITF_SERIE_History[]>((resolve, reject) => {
            axios
                .get<IXXE_WIP_ITF_SERIE_History[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLpn/${lpn}`)
                .then((response) => { resolve(response.data) })
                .catch((error) => { reject(error) })
        })
    }
}