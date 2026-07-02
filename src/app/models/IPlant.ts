import { IBaseEntity } from "./IBaseEntity";
import { ILine } from "./ILine";
import { IRegistry } from "./IRegistry";
import { IResult } from "./IResult";

export interface IPlant extends IBaseEntity {
  deleted?: boolean | null;
  id?: number;
  name: string;
  organizationCode?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  line?: Array<ILine> | null;
  registry?: Array<IRegistry> | null;
  result?: Array<IResult> | null;
}
