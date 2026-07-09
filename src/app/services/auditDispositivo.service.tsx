import { IAuditDispositivo } from "app/models/IAuditDispositivo";
import { IAuditTable } from "app/models/IAuditTable";
import axios from "axios";
import { GenericService } from "./generic.service";

export class AuditDispositivoService extends GenericService<IAuditDispositivo> {
  Url = "AuditDispositivo";
  constructor() {
    super("AuditDispositivo");
  }

  public GetbyTableAndCodigo(tableId: number, codigo: string): Promise<IAuditTable> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditTable>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetbyTableAndCodigo/${tableId}/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByPlantAndTable(tableId: number, plantId: number): Promise<IAuditTable[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAuditTable[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPlantAndTable/${tableId}/${plantId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
