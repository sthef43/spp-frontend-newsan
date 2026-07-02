import { GenericSlice } from "./genericSlice";
import { IDotaFamilia } from "app/models/IDotaFamilia";
import { DotaFamiliaService } from "app/services/dotaFamilia.service";

const dotaFamiliaService = new DotaFamiliaService();
class dotaFamiliaClassSlice extends GenericSlice<IDotaFamilia> {
  constructor(private service: DotaFamiliaService) {
    super("DotaFamilia", service);
  }
}
export const DotaFamiliaSliceRequests = new dotaFamiliaClassSlice(dotaFamiliaService);
