import { IResult } from "app/models/IResult";
import { ResultService } from "app/services/result.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const resultService = new ResultService();
class resultClassSlice extends GenericSlice<IResult> {
  constructor(private service: ResultService) {
    super("Result", service);
  }
  //nuevos asyncthunks aqui
}
export const ResultSliceRequests = new resultClassSlice(resultService);

const initialState: IIniState<IResult> = {
  loading: null,
  data: null
};

export const resultSlice = createSlice({
  name: "Result",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ResultSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
