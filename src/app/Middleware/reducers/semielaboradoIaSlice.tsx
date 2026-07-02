import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISemielaboradoIA } from "app/models/ISemielaboradoIA";
import { SemielaboradoIAService } from "app/services/semielaboradoIA.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";

const semielaboradoIaService = new SemielaboradoIAService();

class SemielaboradoIASlice extends GenericSlice<ISemielaboradoIA> {
  constructor(private service: SemielaboradoIAService) {
    super("SemielaboradoIa", service);
  }
  url = "SemielaboradoIA";

  getByFamiliaAndTipoSemielaborado = createAsyncThunk<ISemielaboradoIA[], { familia; tipo }>(
    `SemielaboradoIA/GetAllInicios`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByFamiliaAndTipoSemielaborado(modelo), info);
    }
  );

  getByFamiliaIdRequest = createAsyncThunk<ISemielaboradoIA[], number>(
    `${this.url}/GetByFamiliaId`,
    async (id, info) => {
      return await errorNotification(() => this.service.getByFamiliaId(id), info);
    }
  );
  getByValorRequest = createAsyncThunk<ISemielaboradoIA, string>(`${this.url}/GetByValor`, async (valor, info) => {
    return await errorNotification(() => this.service.getByValor(valor), info);
  });
  //Cree este post, por que el post del generic, inserta bien, pero cuando termina, devuelve mediante el get, y se rompe cuando quiere hacer el join con tipoSemielaborado, por que esta en otro servidor.
  agregar = createAsyncThunk<ISemielaboradoIA, ISemielaboradoIA>(`${this.url}`, async (valor, info) => {
    return await errorNotification(() => this.service.post(valor), info);
  });
  getByFamiliaRequest = createAsyncThunk<ISemielaboradoIA, string>(
    `${this.url}/getByFamiliaRequest`,
    async (id, info) => {
      return await errorNotification(() => this.service.getByFamiliaRequest(id), info);
    }
  );
  getByFamAndTSemiRequest = createAsyncThunk<ISemielaboradoIA, { familia; tipo }>(
    `${this.url}/getByFamAndTSemiRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByFamAndTSemiRequest(modelo), info);
    }
  );
}

export const SemielaboradoIASliceRequest = new SemielaboradoIASlice(semielaboradoIaService);
