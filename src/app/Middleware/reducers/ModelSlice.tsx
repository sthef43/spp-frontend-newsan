import { IIniState } from "app/models/IIniState";
import { IModel } from "app/models/IModel";
import { ModelService } from "app/services/model.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const modelService = new ModelService();
class modelClassSlice extends GenericSlice<IModel> {
  constructor(private service: ModelService) {
    super("Model", service);
  }
  //nuevos asyncthunks aqui
}
export const ModelSliceRequests = new modelClassSlice(modelService);

const initialState: IIniState<IModel> = {
  loading: null,
  data: null
};

export const modelSlice = createSlice({
  name: "Model",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ModelSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
