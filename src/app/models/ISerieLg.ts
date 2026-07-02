export interface ISerieLg {
  id?: number;
  trazabilidad?: string | "";
  generico?: string | ""; //familia pasa a llamarse
  modelo?: string | "";
  fecha?: string | "";
  impreso?: boolean | false;
  usado?: boolean | false;
  deleted?: boolean | false;
}