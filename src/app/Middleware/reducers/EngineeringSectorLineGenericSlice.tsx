import { IEngineeringSectorLineGeneric } from "app/models/IEngineeringSectorLineGeneric";
import { IIniState } from "app/models/IIniState";
import { EngineeringSectorLineGenericService } from "app/services/engineeringSectorLineGeneric.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const engineeringSectorLineGenericService = new EngineeringSectorLineGenericService();
class engineeringSectorLineGenericClassSlice extends GenericSlice<IEngineeringSectorLineGeneric> {
  constructor(private service: EngineeringSectorLineGenericService) {
    super("EngineeringSectorLineGeneric", service);
  }
  //nuevos asyncthunks aqui
}
export const EngineeringSectorLineGenericSliceRequests = new engineeringSectorLineGenericClassSlice(
  engineeringSectorLineGenericService
);

const initialState: IIniState<IEngineeringSectorLineGeneric> = {
  loading: null,
  data: null
};

export const engineeringSectorLineGenericSlice = createSlice({
  name: "EngineeringSectorLineGeneric",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EngineeringSectorLineGenericSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
