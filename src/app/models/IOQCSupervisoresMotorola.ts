import { IBaseEntity } from "./IBaseEntity";
import { IPlant } from "./IPlant";

export interface IOQCSupervisoresMotorola extends IBaseEntity {
    nombre: string;
    plant?: IPlant;
    plantId: number;

}