import { IDotacion } from "app/features/ingenieria/modules/dotacionMantenimiento/models/IDotacion";
import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IDotacionGrupoSectoresBloque } from "app/features/ingenieria/modules/dotacionMantenimiento/models/IDotacionGrupoSectoresBloque";
import { DatosDotacionDto } from "app/features/ingenieria/modules/dotacionMantenimiento/models/DTOS/DatosDotacionDTO";

export class DotacionService extends GenericService<IDotacion> {
  Url = "Dotacion";
  constructor() {
    super("Dotacion");
  }
  public GetAllByMPLPDH({ modelo, proveedor, linea, potencia, fechaDesde, fechaHasta }): Promise<IDotacion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDotacion[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetAllByMPLPDH/${modelo}/${proveedor}/${linea}/${potencia}/${fechaDesde}/${fechaHasta}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllByDates(fechaDesde: string, fechaHasta: string): Promise<IDotacion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDotacion[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByDates/${fechaDesde}/${fechaHasta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetDotacionBySector(dotacionId: number): Promise<IDotacionGrupoSectoresBloque[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDotacionGrupoSectoresBloque[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetDotacionBySector/${dotacionId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async GetAllDotacionesGroup(fechaDesde: string, fechaHasta: string): Promise<DatosDotacionDto> {
    return new Promise<DatosDotacionDto>((resolve, reject) => {
      axios
        .get<DatosDotacionDto>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllDotacionesGroup/${fechaDesde}/${fechaHasta}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllDotacionGroupInLine(fechaDesde: string, fechaHasta: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      axios
        .get<string[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllDotacionGroupInLine/${fechaDesde}/${fechaHasta}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async SearchThatExistDotacion(todoEnUno: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      axios
        .get<any>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchThatExistDotacion/${todoEnUno}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // public async SearchThatExistDotacion(modelo: string, ritmoPauta: number, ritmoPlan: number): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     axios
  //       .get<any>(`${import.meta.env.VITE_API_URL}/${this.Url}/SearchThatExistDotacion/${modelo}/${ritmoPauta}/${ritmoPlan}`)
  //       .then((response) => { resolve(response.data) })
  //       .catch((error) => { reject(error) })
  //   })
  // }

  public async PostNewDotacionWithNotExist(modelo: IDotacion): Promise<IDotacion> {
    return new Promise<IDotacion>((resolve, reject) => {
      axios
        .post<IDotacion>(`${import.meta.env.VITE_API_URL}/${this.Url}/PostNewDotacionWithNotExist`, modelo)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
