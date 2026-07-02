import { IResultsTimes } from "app/models/IResultsTimes";
import { GenericService } from "./generic.service";

export class ResultsTimesService extends GenericService<IResultsTimes> {
  Url = "ResultsTimes";
  constructor() {
    super("ResultsTimes");
  }
}
