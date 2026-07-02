import { IPlanProd } from "app/models/IPlanProd";
import { IInicio } from "app/models/IInicio";

export const calcularCantidad = (datosPlanProd: IPlanProd) => {
  let cantidad = 0;
  datosPlanProd &&
    datosPlanProd.inicio.map((prodDia: IInicio) => {
      cantidad += prodDia.producido;
    });
  return datosPlanProd.cantidad - cantidad;
};
