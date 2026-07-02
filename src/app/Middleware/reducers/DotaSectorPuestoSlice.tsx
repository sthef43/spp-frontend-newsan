import { GenericSlice } from "./genericSlice";
import { DotaSectorPuestoService } from "app/services/dotaSectorPuesto.service";
import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";

const dotaSectorPuestoService = new DotaSectorPuestoService();
class dotaSectorPuestoClassSlice extends GenericSlice<IDotaSectorPuesto> {
  constructor(private service: DotaSectorPuestoService) {
    super("DotaSectorPuesto", service);
  }
  //nuevos asyncthunks aqui
}
export const DotaSectorPuestoSliceRequests = new dotaSectorPuestoClassSlice(dotaSectorPuestoService);
