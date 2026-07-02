import { createAsyncThunk } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IDotaFamiliaLineaProduccion } from "app/models/IDotaFamiliaLineaProduccion";
import { DotaFamiliaLineaProduccionService } from "app/services/dotaFamiliaLineaProduccion.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dotaFamiliaLineaProduccionService = new DotaFamiliaLineaProduccionService();
class dotaFamiliaLineaProduccionClassSlice extends GenericSlice<IDotaFamiliaLineaProduccion> {
  constructor(private service: DotaFamiliaLineaProduccionService) {
    super("DotaFamiliaLineaProduccion", service);
  }

  GetByFamiliaAndLinea = createAsyncThunk<IDotaFamiliaLineaProduccion, { dotaFamiliaId; lineaProduccionId }>(
    `DotaFamiliaLineaProduccion/GetListByFamiliaAndLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByFamiliaAndLinea(modelo), info);
    }
  );
  UpdateVigenteByDotaFamilineaLineaProduccionId = createAsyncThunk<boolean, number>(
    `DotaFamiliaLineaProduccion/UpdateVigenteByDotaFamilineaLineaProduccionId`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.UpdateVigenteByDotaFamilineaLineaProduccionId(modelo), info);
    }
  );
}
export const DotaFamiliaLineaProduccionSliceRequests = new dotaFamiliaLineaProduccionClassSlice(
  dotaFamiliaLineaProduccionService
);
