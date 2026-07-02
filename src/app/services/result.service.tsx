import { IResult } from "app/models/IResult";
import { GenericService } from "./generic.service";

export class ResultService extends GenericService<IResult> {
  Url = "Result";
  constructor() {
    super("Result");
  }
}
