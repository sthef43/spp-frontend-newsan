import { IEntry } from "app/models/IEntry";
import { GenericService } from "./generic.service";

export class EntryService extends GenericService<IEntry> {
  Url = "Entry";
  constructor() {
    super("Entry");
  }
}
