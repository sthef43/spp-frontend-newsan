import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { ICalidadInspectorTareas } from "./ICalidadInspectorTareas";

export interface ICalidadInspector  extends IBaseEntity{
    codigo: string;
    categoria: string;
    appUserId: number;
    appUser?:IAppUser | null;
    tareas?:ICalidadInspectorTareas[] | [];
}