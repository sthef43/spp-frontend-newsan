import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";

export class OQCHallazgoResultService extends GenericService<IOQCHallazgoResult> {
  Url = "OQCHallazgoResult";
  constructor() {
    super("OQCHallazgoResult");
  }

  public GetAllByOQCId(oqcDesResId: number): Promise<IOQCHallazgoResult[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCHallazgoResult[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByOQCId/${oqcDesResId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
