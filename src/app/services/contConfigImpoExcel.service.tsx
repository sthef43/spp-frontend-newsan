import axios from "axios";
import { GenericService } from "./generic.service";
import { IContConfigImpoExcel } from "app/models/IContConfigImpoExcel";

export class ContConfigImpoExcelService extends GenericService<IContConfigImpoExcel> {
  Url = "ContConfigImpoExcel";
  constructor() {
    super("ContConfigImpoExcel");
  }
  public GetListByPlantId(contPlantaId: number): Promise<IContConfigImpoExcel[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IContConfigImpoExcel[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlantId/${contPlantaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
