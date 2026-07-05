import { IOQCPalet } from "app/models/IOQCPalet";
import { IOQCPaletPrint } from "app/models/IOQCPaletPrint";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";

export function limpiarPalet(palet: IOQCPalet): Partial<IOQCPalet> {
  const { operator, oqcDesignada, oqcModelo, oqcPaletPrint, plant, oqcDesignadaResultado, ...limpio } = palet;
  return limpio;
}

export function limpiarOQCDesignadaResultado(muestra: IOQCDesignadaResultado): Partial<IOQCDesignadaResultado> {
  const { operator, oqcDesignada, oqcHallazgoResult, oqcPalet, operatorCanceled, ...limpio } = muestra;
  return limpio;
}

export function limpiarPaletPrint(paletPrint: IOQCPaletPrint): Partial<IOQCPaletPrint> {
  const { operator, oqcPalet, operatorCanceled, turno, ...limpio } = paletPrint;
  return limpio;
}
