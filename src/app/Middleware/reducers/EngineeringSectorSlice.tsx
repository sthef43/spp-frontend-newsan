import { IEngineeringSector } from "app/models/IEngineeringSector";
import { IIniState } from "app/models/IIniState";
import { EngineeringSectorService } from "app/services/engineeringSector.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const engineeringSectorService = new EngineeringSectorService();
class engineeringSectorClassSlice extends GenericSlice<IEngineeringSector> {
  constructor(private service: EngineeringSectorService) {
    super("EngineeringSector", service);
  }
  //nuevos asyncthunks aqui
}
export const EngineeringSectorSliceRequests = new engineeringSectorClassSlice(engineeringSectorService);

const initialState: IIniState<IEngineeringSector> = {
  loading: null,
  data: null
};

export const engineeringSectorSlice = createSlice({
  name: "EngineeringSector",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EngineeringSectorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
