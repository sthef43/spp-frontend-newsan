import { IDobPlano } from "app/models/IDobPlano";
import { DobPlanoService } from "app/services/dobPlano.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobPlanoService = new DobPlanoService();
class dobPlanoClassSlice extends GenericSlice<IDobPlano> {
  constructor(private service: DobPlanoService) {
    super("DobPlano", service);
  }
  //nuevos asyncthunks aqui
  getListDobPlano = createAsyncThunk<IDobPlano[]>(`DobPlano/getListDobPlano`, async (modelo, info) => {
    return await errorNotification(() => this.service.getListDobPlano(), info);
  });
  getListByRolIdRequest = createAsyncThunk<IDobPlano[], number>(
    `DobPlano/getListByRolIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByRolId(number), info);
    }
  );
}
export const DobPlanoSliceRequests = new dobPlanoClassSlice(dobPlanoService);

const initialState: IIniState<IDobPlano> = {
  loading: null,
  data: null
};

export const dobPlanoSlice = createSlice({
  name: "DobPlano",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobPlanoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});