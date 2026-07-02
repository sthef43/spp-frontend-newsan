/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IBloq } from './IBloq';
import { IItem } from './IItem';
import { IRegistry } from './IRegistry';
import { IValor } from './IValor';

export interface IFinalProduct extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    registryId?: number | null;
    serialNumber?: number | null;
    itemId?: number | null;
    value?: string | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    bloqId?: number | null;
    valorId?: number | null;
    comentario?: string | null;
    flagMail?: boolean | null;
    flagCriterio?: boolean | null;
    bloq?: IBloq;
    item?: IItem;
    registry?: IRegistry;
    valor?: IValor;
}