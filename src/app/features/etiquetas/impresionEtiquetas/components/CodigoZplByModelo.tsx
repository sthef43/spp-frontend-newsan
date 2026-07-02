import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasIndicadoresModeloSliceRequests } from "app/Middleware/reducers/EtiquetasIndicadoresModeloSlice";
import { useAppDispatch } from "app/core/store/store";
import { IEtiquetasIndicadoresModelo } from "app/models/IEtiquetasIndicadoresModelo";
import { IZPL_Etiquetas } from "app/models/IZPL_Etiquetas";

//Esta clase, se encarga de obtener el objeto de la tabla ZPL_EtiquetasIndicadoresModelo, segun sea
//SPlit - Unidad Interior o Unidad Exterior. o Ventana.
//Y tambien, devuelve el codigo zpl, con los valores ya reemplazados.
export class CodigoZplByModelo {
  dispatch = useAppDispatch();

  getEtiquetaIndicadorModelo = () => {
    const result = ""; /* unwrapResult(await dispatch()); */
  };

  armarCodigoZpl = (etiquetaIndicadorModelo: IEtiquetasIndicadoresModelo, etiqueta: IZPL_Etiquetas) => {
    const arrayOfAtributes = Object.getOwnPropertyNames(etiquetaIndicadorModelo);
    const arrayOfValueOfAtributes = Object.values(etiquetaIndicadorModelo);
    const arrayOfAtributesChange = arrayOfAtributes.map((x) => (x = "&&" + x + "&&"));
    console.log("ArrayOfAtributes Reemplazado");
    console.log(arrayOfAtributesChange);
    let codeZpl = etiqueta.ZPL;
    let i = 0;
    arrayOfAtributesChange.forEach((element) => {
      if (arrayOfValueOfAtributes[i] != null) {
        codeZpl = codeZpl.replace(element, arrayOfValueOfAtributes[i]);
      }
      i += 1;
    });
    console.log("codigo sin reemplazar");
    console.log(etiqueta.ZPL);
    console.log("codigo zpl reemplazado! ");
    console.log(codeZpl);
    return codeZpl;
  };

  getCodigoZpl = async (etiqueta, producto) => {
    console.log("etiqueta q recibo");
    console.log(etiqueta);

    let result = [];
    let param;
    if (etiqueta.tipoEquipo == "I") param = { tipoM: "SP", tipoU: "UI" };
    else if (etiqueta.tipoEquipo == "E") param = { tipoM: "SP", tipoU: "UE" };
    else param = { tipoM: "VE", tipoU: null };
    try {
      result = unwrapResult(await this.dispatch(EtiquetasIndicadoresModeloSliceRequests.getAllByTipoM(param)));
    } catch (ex) {
      console.log(ex);
    }
    if (result) {
      const obj = result.find((x) => x.codigoEBS == producto.codigoEBS);
      return this.armarCodigoZpl(obj, etiqueta);
    }
  };
}
