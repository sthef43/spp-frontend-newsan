import { IReporteSGI, ReporteSGIFilterDTO } from "app/features/sgi/reporteSgi/models/ReporteSGIModel";
import axios from "axios";
import { GenericService } from "./generic.service";

export class ReporteSGIService extends GenericService<IReporteSGI> {
  url = "ReporteSGI";
  constructor() {
    super("ReporteSGI");
  }

  SearchByFilter(filter: ReporteSGIFilterDTO): Promise<IReporteSGI[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<IReporteSGI[]>(`${import.meta.env.VITE_API_URL}/${this.url}/SearchByFilter`, filter)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  // Search repeated
  SearchRepetead(reporte: IReporteSGI[]): Promise<IReporteSGI[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<IReporteSGI[]>(`${import.meta.env.VITE_API_URL}/${this.url}/SearchRepetead`, reporte)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
