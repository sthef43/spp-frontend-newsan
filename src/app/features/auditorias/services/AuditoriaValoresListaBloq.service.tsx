import { GenericService } from "app/services/generic.service";
import { IAuditoriaValoresListaBloq } from "../models/IAuditoriaValoresListaBloq";

export class AuditoriaValoresListaBloqService extends GenericService<IAuditoriaValoresListaBloq> {
  Url = "AuditoriaValoresListaBloq";
  constructor() {
    super("AuditoriaValoresListaBloq");
  }
}
