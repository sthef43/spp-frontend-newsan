interface CodigoRechazoCampos  {
  descripcionPuesto: string;
  totaliza:string
}
export interface ResumenMensualRechazos {
  id: number;
  puesto: number;
  codigoRechazoCampos: CodigoRechazoCampos;
  fecha: string,
  total:number
}