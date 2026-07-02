import { GenericService } from "../../../services/generic.service";
import { IOQCReprocesoCelulares } from "app/models/IOQCReprocesoCelulares";
import axios from "axios";

export class OQCReprocesoCelularesService extends GenericService<IOQCReprocesoCelulares> {
  Url = "OQCReprocesoCelulares";
  constructor() {
    super("OQCReprocesoCelulares");
  }

  public async GetSampleByTrackId(trackId: string): Promise<IOQCReprocesoCelulares> {
    return new Promise<IOQCReprocesoCelulares>((resolve, reject) => {
      axios
        .get<IOQCReprocesoCelulares>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetSampleByTrackId/${trackId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetListSamplesByLpn(lpn: string): Promise<IOQCReprocesoCelulares[]> {
    return new Promise<IOQCReprocesoCelulares[]>((resolve, reject) => {
      axios
        .get<IOQCReprocesoCelulares[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListSamplesByLpn/${lpn}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetSampleByImeiCode(imeiCode: string): Promise<IOQCReprocesoCelulares> {
    return new Promise<IOQCReprocesoCelulares>((resolve, reject) => {
      axios
        .get<IOQCReprocesoCelulares>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetSampleByImeiCode/${imeiCode}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
