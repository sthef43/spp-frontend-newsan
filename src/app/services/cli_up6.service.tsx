import { IStock_UP6 } from "app/models/IStock_UP6";
import axios from "axios";

export class Stock_UP6Service {
    Url = "Stock_UP6";
    public getByLocalizador({ localizador }): Promise<IStock_UP6[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IStock_UP6[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLocalizador/${localizador}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
}