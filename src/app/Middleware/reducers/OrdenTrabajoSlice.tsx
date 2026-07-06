import { createAsyncThunk } from "@reduxjs/toolkit";
import { IOrdenTrabajo } from "app/models/IOrdenTrabajo";
import { OrdenTrabajoService } from "app/services/ordenTrabajo.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const ordenTrabajoService = new OrdenTrabajoService();

class OrdenTrabajoSlice {
  constructor(private service: OrdenTrabajoService) {}

  getByModeloAndPanel = createAsyncThunk<IOrdenTrabajo, { modelo; panel }>(
    "ordenTrabajo/GetByModeloAndPanel",
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByModeloAndPanelRequest(modelo), info);
    }
  );
}
export const OrdenTrabajoSliceRequestest = new OrdenTrabajoSlice(ordenTrabajoService);
