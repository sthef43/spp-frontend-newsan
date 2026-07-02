import { IBaseEntity, IOperator } from ".";
import { IRoutes } from "./IRoutes";

export interface IRoutesFavoritesOperatorBloq extends IBaseEntity {
    operatorId: number
    operator?: IOperator
    routesId: number
    routes?: IRoutes[]
}