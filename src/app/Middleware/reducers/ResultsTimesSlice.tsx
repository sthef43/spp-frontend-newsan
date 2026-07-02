import { IResultsTimes } from "app/models/IResultsTimes";
import { ResultsTimesService } from "app/services/resultsTimes.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const resultsTimesService = new ResultsTimesService();
class resultsTimesClassSlice extends GenericSlice<IResultsTimes> {
  constructor(private service: ResultsTimesService) {
    super("ResultsTimes", service);
  }
  //nuevos asyncthunks aqui
}
export const ResultsTimesSliceRequests = new resultsTimesClassSlice(resultsTimesService);

const initialState: IIniState<IResultsTimes> = {
  loading: null,
  data: null
};

export const resultsTimesSlice = createSlice({
  name: "ResultsTimes",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ResultsTimesSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
