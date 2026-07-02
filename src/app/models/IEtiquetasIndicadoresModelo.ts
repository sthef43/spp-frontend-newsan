import { IBaseEntity } from "./IBaseEntity";

export interface IEtiquetasIndicadoresModelo extends IBaseEntity {
  tipoDeModelo: string;
  codigoEBS: string;
  marca: string;
  logoMarca: string;
  codigoModeloExt?: string;
  codigoModeloInt?: string;
  tipoUnidadExt?: string;
  tipoUnidadInt?: string;
  codigoModeloVentana?: string;
  capacidadRefrigeracion?: string;
  capacidadCalefaccion?: string;
  tensionNominal?: string;
  frecuenciaNominal?: string;
  potenciaMaxRefri?: string;
  potenciaMaxCalef?: string;
  potenciaRefrigeracion?: string;
  potenciaCalefaccion?: string;
  valorFusible?: string;
  presionDescargaRefrigerante?: string;
  presionSuccionRefrigerante?: string;
  presionItercambiadorCalor?: string;
  refrigerante?: string;
  tipoRefrigerante?: string;
  cargaRefrigerante?: string;
  nivelRuido?: string;
  circulacionAire?: string;
  tipoClimatico?: string;
  corrienteRotorBloqCompesor?: string;
  artefactoBase?: string;
  proteccionHumedad?: string;
  pesoNeto?: string;
}
