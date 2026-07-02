import { ICodigosDeRechazos } from "app/models/ICodigosDeRechazos";
import { GenericService } from "./generic.service";

export class CodigosDeRechazosService extends GenericService<ICodigosDeRechazos> {
  Url = "CodigosDeRechazos";
  constructor() {
    super("CodigosDeRechazos");
  }
}
