import { IDobImpresionesPlanos } from "app/models/IDobImpresionesPlanos";
import { DobImpresionesPlanosService } from "app/services/dobImpresionesPlanos.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobImpresionesPlanosService = new DobImpresionesPlanosService();
class dobImpresionesPlanosClassSlice extends GenericSlice<IDobImpresionesPlanos> {
  constructor(private service: DobImpresionesPlanosService) {
    super("DobImpresionesPlanos", service);
  }
  //nuevos asyncthunks aqui
  getByDobPlano = createAsyncThunk<IDobImpresionesPlanos[], number>(
    `DobImpresionesPlanos/getByDobPlano`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByDobPlano(modelo), info);
    }
  );
}
export const DobImpresionesPlanosSliceRequests = new dobImpresionesPlanosClassSlice(dobImpresionesPlanosService);

const initialState: IIniState<IDobImpresionesPlanos> = {
  loading: null,
  data: null
};

export const dobImpresionesPlanosSlice = createSlice({
  name: "DobImpresionesPlanos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobImpresionesPlanosSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
