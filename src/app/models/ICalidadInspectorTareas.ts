import { IBaseEntity } from "./IBaseEntity"
import { ICalidadInspeccionTarea } from "./ICalidadInspeccionTarea"
import { ICalidadInspector } from "./ICalidadInspector"

export interface ICalidadInspectorTareas extends IBaseEntity {
  calidadInspectorId?: number
  inspector?: ICalidadInspector
  calidadInspeccionTareaId?: number
  inspeccionTarea?:ICalidadInspeccionTarea
}