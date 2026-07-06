import { IDotacionModelo } from "app/features/ingenieria/modules/dotacionMantenimiento/models/IDotacionModelo";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { DotacionModeloService } from "../services/dotacionModelo.service";

const dotacionModeloService = new DotacionModeloService();
class dotacionModeloClassSlice extends GenericSlice<IDotacionModelo> {
  constructor(private service: DotacionModeloService) {
    super("DotacionModelo", service);
  }
}
export const DotacionModeloSliceRequests = new dotacionModeloClassSlice(dotacionModeloService);
