//Modelo para representar los campos que devuelve un SP del SQL Server, llamado SP_repacaciones.
//Las columnas q devuelve esta relacionada con la tala Reparacion, Defecto, Causa y Origen.

export interface ISPReparacion {
  codigoDefecto: string;
  descripcionDefecto: string;
  codigoCausa: string;
  descripcionCausa: string;
  codigoOrigen: string;
  descripcionOrigen: string;
  total: number;
}
