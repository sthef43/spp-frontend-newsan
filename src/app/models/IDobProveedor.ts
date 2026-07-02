import { IBaseEntity } from './IBaseEntity';
import { IDobSemi } from './IDobSemi';


export interface IDobProveedor extends IBaseEntity {
    codigo: string;
    descripcion?: string | null;    
    dobSemi?: Array<IDobSemi> | null;
}