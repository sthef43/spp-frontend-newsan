export interface IMainReg {
  idRegistro: number;
  idLinea?: number | null;
  codigo?: string | null;
  fecha?: string | null;
  hora?: string | null;
  estado?: number | null;
  turno?: string | null;
  trazaCaja?: string | null;
  idInicio?: number | null;
  fecha_P2?: string | null;
  hora_P2?: string | null;
  turno_P2?: string | null;
  trazaEva?: string | null;
}
