import { IBaseEntity } from './IBaseEntity';
import { IDobSemi } from './IDobSemi';


export interface IDobTipoAA extends IBaseEntity {
    codigo: string;
    descripcion?: string | null;    
    dobSemi?: Array<IDobSemi> | null;
}