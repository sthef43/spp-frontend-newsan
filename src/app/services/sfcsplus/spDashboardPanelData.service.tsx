import axios from "axios";
import { ISPDashboardGetPanelData } from "app/models/sfcsplus/ISPDashboardGetPanelData";

export class SPDashboard_GetLinePanelDataSfcsplusService {
  Url = "SP_Dashboard_GetLinePanelData";
  public GetListByLineaId({ lineaId, fecha }): Promise<ISPDashboardGetPanelData> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISPDashboardGetPanelData>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetProducidosByLineaAndFecha/${lineaId}/${fecha}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
