import { IEngineeringSectorPosition } from "app/models/IEngineeringSectorPosition";
import { IIniState } from "app/models/IIniState";
import { EngineeringSectorPositionService } from "app/services/engineeringSectorPosition.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const engineeringSectorPositionService = new EngineeringSectorPositionService();
class engineeringSectorPositionClassSlice extends GenericSlice<IEngineeringSectorPosition> {
  constructor(private service: EngineeringSectorPositionService) {
    super("EngineeringSectorPosition", service);
  }
  //nuevos asyncthunks aqui
}
export const EngineeringSectorPositionSliceRequests = new engineeringSectorPositionClassSlice(
  engineeringSectorPositionService
);

const initialState: IIniState<IEngineeringSectorPosition> = {
  loading: null,
  data: null
};

export const engineeringSectorPositionSlice = createSlice({
  name: "EngineeringSectorPosition",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EngineeringSectorPositionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
