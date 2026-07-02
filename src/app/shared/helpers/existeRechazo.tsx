import { IControlLote } from "app/models/IControlLote";

export const existeRechazo = (numero: number, rechazos: IControlLote[]) => {
  console.log(rechazos);
  console.log(numero);
  let aux = false;
  let controlLoteId = null;
  rechazos.map((rech) => {
    if (numero >= rech.serieDesde && numero <= rech.serieHasta) {
      aux = true;
      controlLoteId = rech.idControlLote;
    }
  });
  return { existe: aux, controlLoteId };
};
