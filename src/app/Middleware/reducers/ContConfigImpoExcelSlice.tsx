import { IContConfigImpoExcel } from "app/models/IContConfigImpoExcel";
import { ContConfigImpoExcelService } from "app/services/contConfigImpoExcel.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const contConfigImpoExcelService = new ContConfigImpoExcelService();
class contConfigImpoExcelClassSlice extends GenericSlice<IContConfigImpoExcel> {
  constructor(private service: ContConfigImpoExcelService) {
    super("ContConfigImpoExcel", service);
  }
  //nuevos asyncthunks aqui
  getListByPlantIdRequest = createAsyncThunk<IContConfigImpoExcel[], number>(
    `ContConfigImpoExcel/getListByPlantIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByPlantId(number), info);
    }
  );
}
export const ContConfigImpoExcelSliceRequests = new contConfigImpoExcelClassSlice(contConfigImpoExcelService);

const initialState: IIniState<IContConfigImpoExcel> = {
  loading: null,
  data: null
};

export const contConfigImpoExcelSlice = createSlice({
  name: "ContConfigImpoExcel",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContConfigImpoExcelSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
