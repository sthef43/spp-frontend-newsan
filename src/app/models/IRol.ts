/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from './IBaseEntity';
import { IArea } from './IArea';
import { IAudit } from './IAudit';
import { IAuditBloq } from './IAuditBloq';
import { IAuditCriterio } from './IAuditCriterio';
import { IAuditMail } from './IAuditMail';
import { IAuditType } from './IAuditType';
import { IBloq } from './IBloq';
import { IEmailGroup } from './IEmailGroup';
import { IEntry } from './IEntry';
import { IExit } from './IExit';
import { IItem } from './IItem';
import { ILocation } from './ILocation';
import { IPermisos } from './IPermisos';
import { IProduct } from './IProduct';
import { IRegistry } from './IRegistry';
import { ITodo } from './ITodo';
import { IUbicacion } from './IUbicacion';

export interface IRol extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    area?: Array<IArea> | null;
    audit?: Array<IAudit> | null;
    auditBloq?: Array<IAuditBloq> | null;
    auditCriterio?: Array<IAuditCriterio> | null;
    auditMail?: Array<IAuditMail> | null;
    auditType?: Array<IAuditType> | null;
    bloq?: Array<IBloq> | null;
    emailGroup?: Array<IEmailGroup> | null;
    entry?: Array<IEntry> | null;
    exit?: Array<IExit> | null;
    item?: Array<IItem> | null;
    location?: Array<ILocation> | null;
    permisos?: Array<IPermisos> | null;
    product?: Array<IProduct> | null;
    registry?: Array<IRegistry> | null;
    todo?: Array<ITodo> | null;
    ubicacion?: Array<IUbicacion> | null;
}