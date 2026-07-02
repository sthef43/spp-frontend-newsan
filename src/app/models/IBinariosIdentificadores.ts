import { IBaseEntity } from "./IBaseEntity";

interface AcumuladoBinarios {
  familia :string
  identificador: number
  diario:number
  producido :number
  consumido :number
  acumulado:number
}

export interface IBinariosIdentificadores extends IBaseEntity {
  nombre: string;
  acumuladoBinarios?:AcumuladoBinarios[]
}
