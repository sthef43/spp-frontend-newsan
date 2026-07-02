import { createAsyncThunk } from "@reduxjs/toolkit";
import { ComunicadoService } from "app/services/comunicado.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IComunicado } from "app/models/IComunicado";

const comunicadoService = new ComunicadoService();

class ComunicadoClasSliceRequest {
  constructor(private service: ComunicadoService) {}

  put = createAsyncThunk<boolean, IComunicado>(`Comunicado/put`, async (modelo, info) => {
    return await errorNotification(() => this.service.update(modelo), info);
  });

  getList = createAsyncThunk<IComunicado[]>(`Comunicado/GetList`, async (modelo, info) => {
    return await errorNotification(() => this.service.getList(), info);
  });
}

export const ComunicadoSliceRequest = new ComunicadoClasSliceRequest(comunicadoService);

/* const ComunicacionClassSliceRequest = ComunicacionClass(comunicacionService); */
