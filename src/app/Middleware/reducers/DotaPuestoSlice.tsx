import { GenericSlice } from "./genericSlice";
import { DotaPuestoService } from "app/services/dotaPuesto.,service";
import { IDotaPuesto } from "app/models/IDotaPuesto";

const dotaPuestoService = new DotaPuestoService();
class dotaPuestoClassSlice extends GenericSlice<IDotaPuesto> {
  constructor(private service: DotaPuestoService) {
    super("DotaPuesto", service);
  }
}
export const DotaPuestoSliceRequests = new dotaPuestoClassSlice(dotaPuestoService);
