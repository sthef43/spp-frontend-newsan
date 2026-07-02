import { IInstlimite } from "./IInstlimite";

export interface IInsttraza {
  idInsttraza: number;
  fecha: string;
  hora: string;
  turno: string;
  verificacion1: string;
  verificacion2: string;
  verificacion3: string;
  verificacion4: string;
  observaciones: string;
  idInstlimite: number;
  instlimite: IInstlimite;
  correccion: string;
  horaString: string;
}
