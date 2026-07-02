import { IStock_CLI } from "app/models/IStock_CLI";
import axios from "axios";

export class Stock_CLIService {
    Url = "Stock_CLI";
    public getByLocalizador(localizador: string): Promise<IStock_CLI[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<IStock_CLI[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLocalizador/${localizador}`)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
}