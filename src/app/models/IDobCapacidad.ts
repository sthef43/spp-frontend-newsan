import { IBaseEntity } from './IBaseEntity';
import { IDobSemi } from './IDobSemi';


export interface IDobCapacidad extends IBaseEntity {
    codigo: string;
    descripcion?: string | null;    
    dobSemi?: Array<IDobSemi> | null;
}