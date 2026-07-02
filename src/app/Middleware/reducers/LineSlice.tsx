import { IIniState } from "app/models/IIniState";
import { ILine } from "app/models/ILine";
import { LineService } from "app/services/line.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const lineService = new LineService();
class lineClassSlice extends GenericSlice<ILine> {
  constructor(private service: LineService) {
    super("Line", service);
  }
  //nuevos asyncthunks aqui
  getAllUnrelatedRequest = createAsyncThunk<ILine[]>(`Line/GetAllUnrelated`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllUnrelated(), info);
  });
  getListByPlantaIdRequest = createAsyncThunk<ILine[], number>(
    `Line/getListByPlantaIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByPlantaId(number), info);
    }
  );
}
export const LineSliceRequests = new lineClassSlice(lineService);

const initialState: IIniState<ILine> = {
  loading: null,
  data: null,
  dataAll: []
};

export const lineSlice = createSlice({
  name: "Line",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    LineSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(LineSliceRequests.getAllUnrelatedRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineSliceRequests.getAllUnrelatedRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
