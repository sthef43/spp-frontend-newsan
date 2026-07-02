export interface ITrazabilidadLg {
  id: number;
  trazabilidad: string;
  servisLg: string;
  estado?: boolean;
  createdDate?: Date;
  deleted?: boolean;
  finalizado?: boolean;
}
