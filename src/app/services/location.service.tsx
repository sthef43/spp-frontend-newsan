import { ILocation } from "app/models/ILocation";
import { GenericService } from "./generic.service";

export class LocationService extends GenericService<ILocation> {
  Url = "Location";
  constructor() {
    super("Location");
  }
}
