import axios from "axios";

export class ZPL_PrintService {
  Url = "ZPL_Print";
  public getPrints(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<string>>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
    }
  /*  public print(): Promise<boolean, > {
    return new Promise((resolve, reject) => {
      axios
        .get<Array<string>>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  } */
}
