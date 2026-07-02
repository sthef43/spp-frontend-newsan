import axios from "axios";
export class ZPL_ImpresoraService {
  Url = "ZPL_Print";
  public getPrinters(): Promise<[]> {
    console.log("service");
    console.log(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPrinters`);

    return new Promise((resolve, reject) => {
      axios
        .get<[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetPrinters`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getPrintsWithPort(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        axios
            .get<Array<string>>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPrinterListWithPort`)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
  }
  /*  public print({ namePrinter, codeZpl }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log("service de impresora");
      console.log(`${import.meta.env.VITE_API_URL}/${this.Url}/Print/${namePrinter}/${codeZpl}`);

      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/Print/${namePrinter}/${codeZpl}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  } */
  public print(entity: Array<string>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
