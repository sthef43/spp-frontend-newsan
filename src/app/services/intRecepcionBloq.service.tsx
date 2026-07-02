import { GenericService } from "app/services/generic.service";
import { IIntRecepcionBloq } from "../models/IIntRecepcionBloq";

export class IntRecepcionBloqService extends GenericService<IIntRecepcionBloq> {
    Url = "IntRecepcionBloq";
    constructor() {
        super("IntRecepcionBloq");
    }
}