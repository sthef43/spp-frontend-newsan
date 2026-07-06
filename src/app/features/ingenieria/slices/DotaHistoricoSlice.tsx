import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { DotaHistoricoService } from "../services/dotaHistorico.service";
import { IDotaHistorico } from "app/models/IDotaHistorico";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const dotaHistoricoService = new DotaHistoricoService();
class dotaHistoricoClassSlice extends GenericSlice<IDotaHistorico> {
  constructor(private service: DotaHistoricoService) {
    super("DotaHistorico", service);
  }
  getNumeroSiguienteByLineaAndFamiliaRequest = createAsyncThunk<number, { lineaProduccionId; dotaFamiliaId }>(
    `DotaHistorico/GetNumeroSiguienteByLineaAndFamilia`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetNumeroSiguienteByLineaAndFamilia(modelo), info);
    }
  );
  getListByLineaAndFamiliaRequest = createAsyncThunk<IDotaHistorico[], { lineaProduccionId; dotaFamiliaId }>(
    `DotaHistorico/GetListByLineaAndFamilia`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByLineaAndFamilia(modelo), info);
    }
  );
}
export const DotaHistoricoSliceRequests = new dotaHistoricoClassSlice(dotaHistoricoService);
