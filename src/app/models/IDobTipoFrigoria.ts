import { IBaseEntity } from './IBaseEntity';
import { IDobSemi } from './IDobSemi';


export interface IDobTipoFrigoria extends IBaseEntity {
    codigo: string;
    descripcion?: string | null;    
    dobSemi?: Array<IDobSemi> | null;
}