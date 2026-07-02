import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IReporteSGI, ReporteSGIFilterDTO } from "app/features/sgi/reporteSgi/models/ReporteSGIModel";
import { GenericSlice } from "./genericSlice";

// import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ReporteSGIService } from "app/services/reporteSGI.service";
import { IIniState } from "app/models";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const reporteSGIService = new ReporteSGIService();
class ReporteSGIClassSlice extends GenericSlice<IReporteSGI> {
  constructor(private service: ReporteSGIService) {
    super("Permisos", service);
  }

  SearchByFilter = createAsyncThunk<IReporteSGI[], ReporteSGIFilterDTO>(
    `ReporteSGI/SearchRepetead`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.SearchByFilter(modelo), info);
    }
  );

  SearchRepetead = createAsyncThunk<IReporteSGI[], IReporteSGI[]>(`ReporteSGI/SearchRepetead`, async (modelo, info) => {
    return await errorNotification(() => this.service.SearchRepetead(modelo), info);
  });
}
export const ReporteSGISliceRequests = new ReporteSGIClassSlice(reporteSGIService);

const initialState: IIniState<IReporteSGI> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const reporteSGISlice = createSlice({
  name: "ReporteSGI",
  initialState: initialState,
  reducers: {}
});
