/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { ReporteOQC } from "app/models/Stored Procdure/ReporteOQC";
import { NumerosNewsanDTO } from "app/models/DTO/NumerosNewsanDTO";
import { IDatesMotorola } from "app/models/sfcsplus/IDatesMotorola";

export class OQCDesignadaResultadoService extends GenericService<IOQCDesignadaResultado> {
  Url = "OQCDesignadaResultado";
  constructor() {
    super("OQCDesignadaResultado");
  }
  getAllByDateAndLineaAndTurno({ fechaDesde, fechaHasta, lineaId, turnoAbre }): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllByDateAndLineaId/${fechaDesde}/${fechaHasta}/${lineaId}/${turnoAbre}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getSGIReportRequest({ year, lineaId }): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReporteSGIByLineaId/${year}/${lineaId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getSGIReportByProductoRequest({ year, productId }): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReporteSGIByProductId/${year}/${productId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getSGIReportByModeloRequest({ year, modelo }): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReporteSGIByModelo/${year}/${modelo}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getModelosByLinea(lineaId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<string[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllModelosByLinea/${lineaId}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllRegisterByLPN(lpn: string): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllRegisterByLPN/${lpn}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllRegistersByPalletId(palletId: number): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${this.url}/GetAllRegisterByPalletId/${palletId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllRegistersByDateAndLineaId({ fechaDesde, fechaHasta, lineaId }): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllRegistersByDateAndLineaId/${fechaDesde}/${fechaHasta}/${lineaId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllRegistersByDateAndLineaIdWithLengthFind({
    fechaDesde,
    fechaHasta,
    lineaId,
    turnoAbreviatura
  }): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllRegistersByDateAndLineaIdWithLengthFind/${fechaDesde}/${fechaHasta}/${lineaId}/${turnoAbreviatura}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getReportOQCByDatesAndLine({
    fechaDesde,
    fechaHasta,
    lineaId,
    turnoAbreviatura,
    opcionHallazgo
  }): Promise<IOQCDesignadaResultado[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetReportOQCByDatesAndLine/${fechaDesde}/${fechaHasta}/${lineaId}/${turnoAbreviatura}/${opcionHallazgo}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getBySerieNumber(numeroSerie: string): Promise<IOQCDesignadaResultado> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetBySerieNumber/${numeroSerie}`)
        .then((responde) => {
          resolve(responde.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getNewsanFromAndUntil(palletId: number): Promise<NumerosNewsanDTO> {
    return new Promise((resolve, reject) => {
      axios
        .get<NumerosNewsanDTO>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetNewsanFromAndUntil/${palletId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getLastReportByPalletId(palletId: number): Promise<IOQCDesignadaResultado> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLastReportByPalletId/${palletId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getReportForPlant({ fechaDesde, fechaHasta, plantaId }) {
    return new Promise((resolve, reject) => {
      axios
        .get<ReporteOQC[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetReportsSp/${fechaDesde}/${fechaHasta}/${plantaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getReportOQCByDatesAndPlant({ fechaDesde, fechaHasta, plantaId }) {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetReportOQCByDatesAndPlant/${fechaDesde}/${fechaHasta}/${plantaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  GetAlldatesByOQCId(oqcId: number): Promise<IOQCDesignadaResultado> {
    return new Promise<IOQCDesignadaResultado>((resolve, reject) => {
      axios
        .get<IOQCDesignadaResultado>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAlldatesByOQCId/${oqcId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public async GetAllDatesMotorola(trackId: string): Promise<IDatesMotorola[]> {
    return new Promise<IDatesMotorola[]>((resolve, reject) => {
      axios
        .get<IDatesMotorola[]>(`https://api-motorola.newsan.com.ar/HistoryByCode/${trackId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
