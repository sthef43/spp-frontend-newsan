import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { DobCaniosSubService } from "app/services/dobCaniosSub.service";
import { IDobCaniosSub } from "app/models/IDobCaniosSub";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IDobCaniosSubDto } from "app/models/IDobCaniosSubDto";

const dobCaniosSubService = new DobCaniosSubService();
class dobCaniosSubClassSlice extends GenericSlice<IDobCaniosSub> {
  constructor(private service: DobCaniosSubService) {
    super("DobCaniosSub", service);
  }
  //nuevos asyncthunks aqui
  getListByLpnRequest = createAsyncThunk<IDobCaniosSub[], string>(
    `IDobCaniosSub/getListByLpnRequest`,
    async (string, info) => {
      return await errorNotification(() => this.service.GetListByLpn(string), info);
    }
  );
  getListByNumeroOPRequest = createAsyncThunk<IDobCaniosSubDto[], string>(
    `IDobCaniosSub/getListByNumeroOPRequest`,
    async (string, info) => {
      return await errorNotification(() => this.service.GetListByNumeroOP(string), info);
    }
  );

}
export const DobCaniosSubSliceRequests = new dobCaniosSubClassSlice(dobCaniosSubService);

const initialState: IIniState<IDobCaniosSub> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const dobCaniosSubSlice = createSlice({
  name: "DobCaniosSub",
  initialState: initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<IDobCaniosSub[]>) => {
      state.dataAll = action.payload;
    }
  },
  extraReducers: (builder) => {
    DobCaniosSubSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
