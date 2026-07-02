import { IZPL_EtiquetaFija } from "./IZPL_EtiquetaFija";
import { IZPL_Impresiones } from "./IZPL_Impresiones";

export interface IZPL_ImpresionesEtiquetaFija {
  id?: number;
  ZPL_ImpresionesId: number;
  ZPL_EtiquetaFijaId: number;
  ZPL_Impresiones?: IZPL_Impresiones;
  ZPL_EtiquetaFija?: IZPL_EtiquetaFija;
}
