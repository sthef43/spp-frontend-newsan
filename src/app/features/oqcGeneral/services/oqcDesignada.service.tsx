import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCDesignada } from "app/models/IOQCDesignada";

export class OQCDesignadaService extends GenericService<IOQCDesignada> {
  Url = "OQCDesignada";
  constructor() {
    super("OQCDesignada");
  }
  public GetAllByLineaIdAndTurnoRequest(lineaId: number, turnoId: number): Promise<IOQCDesignada[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignada[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaId/${lineaId}/${turnoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByOQCId(oqcId: number): Promise<IOQCDesignada[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignada[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByOQCId/${oqcId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
