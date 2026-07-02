import { IFinalProductSamples } from "app/models/IFinalProductSamples";
import { GenericService } from "./generic.service";

export class FinalProductSamplesService extends GenericService<IFinalProductSamples> {
  Url = "FinalProductSamples";
  constructor() {
    super("FinalProductSamples");
  }
}
