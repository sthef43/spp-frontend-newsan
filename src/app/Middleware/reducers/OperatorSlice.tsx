import { IOperator } from "app/models/IOperator";
import { OperatorService } from "app/services/operator.service";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const operatorService = new OperatorService();
class operatorClassSlice extends GenericSlice<IOperator> {
  constructor(private service: OperatorService) {
    super("Operator", service);
  }
  //nuevos asyncthunks aqui
  getInfoByDni = createAsyncThunk<IOperator, number>(`Operator/GetUserByDni`, async (dni, info) => {
    return await errorNotification(() => this.service.GetInfoByDni(dni), info);
  });
  getListOperator = createAsyncThunk<IOperator[]>(`Operator/getListOperator`, async (modelo, info) => {
    return await errorNotification(() => this.service.getListOperator(), info);
  });
  getListOperatorByRol = createAsyncThunk<IOperator[], number>(`Operator/getListOperatorByRol`, async (rolId, info) => {
    return await errorNotification(() => this.service.getListOperatorByRol(rolId), info);
  });
}
export const OperatorSliceRequests = new operatorClassSlice(operatorService);

const initialState: IIniState<IOperator> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const operatorSlice = createSlice({
  name: "Operator",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOperator>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OperatorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OperatorSliceRequests.getInfoByDni.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(OperatorSliceRequests.getInfoByDni.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
