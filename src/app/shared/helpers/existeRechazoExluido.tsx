import { IControlLote } from "app/models/IControlLote";

// aca busco si existe algun rechazo que contenga el rango de serie que quiero rechazar,
// PERO EXCLUYO EL RECHAZO QUE ESTOY EDITANDO
// de esta forma me evito el error de "ya existe un rechazo" cuando es el mismo que estoy editando
export const existeRechazoExcluido = (numero: number, rechazos: IControlLote[], idRechazado: number): boolean => {
  const rechazosAux = rechazos.filter((r) => r.idControlLote !== idRechazado);
  console.log(rechazosAux, "rechazos sin el que edito");
  let aux = false;
  rechazosAux.map((rech) => {
    if (numero >= rech.serieDesde && numero <= rech.serieHasta) {
      aux = true;
    }
  });
  return aux;
};
