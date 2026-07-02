import { ISuperMercadoEtiquetas } from "app/models/ISuperMercadoEtiquetas";
import { GenericService } from "./generic.service";

export class SuperMercadoEtiquetasService extends GenericService<ISuperMercadoEtiquetas> {
  Url = "SuperMercadoEtiquetas";
  constructor() {
    super("SuperMercadoEtiquetas");
  }
}
