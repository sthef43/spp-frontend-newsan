import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCPaletPrint } from "app/models/IOQCPaletPrint";

export class OQCPaletPrintService extends GenericService<IOQCPaletPrint> {
  Url = "OQCPaletPrint";
  constructor() {
    super("OQCPaletPrint");
  }

  public GetAllByPalet(id: number): Promise<IOQCPaletPrint[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCPaletPrint[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPalet/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public postSimulation(model: IOQCPaletPrint): Promise<IOQCPaletPrint> {
    return new Promise((resolve, reject) => {
      axios
        .post<IOQCPaletPrint>(`${import.meta.env.VITE_API_URL}/${this.Url}/postSimulation`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
