import axios from "axios";
import { IOQCNuevoPallet } from "../../../models/IOQCNuevoPallet";
import { GenericService } from "../../../services/generic.service";

export class OQCNuevoPalletService extends GenericService<IOQCNuevoPallet> {
  Url = "OQCNuevoPallet";

  constructor() {
    super("OQCNuevoPallet");
  }
  public GetAllByLpn(lpn: string): Promise<IOQCNuevoPallet[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCNuevoPallet[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLpn/${lpn}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByPaletId(paletId: number): Promise<IOQCNuevoPallet[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCNuevoPallet[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPaletId/${paletId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByReferenciaCode(codeReferencia: string): Promise<IOQCNuevoPallet> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCNuevoPallet>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCodeReferencia/${codeReferencia}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
