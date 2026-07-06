import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IExpRegularValores } from "app/models/IExpRegularValores";
import { ExpRegularValoresService } from "app/services/expRegularValores.service";
const expRegularValoresService = new ExpRegularValoresService();
class expRegularValoresClassSlice extends GenericSlice<IExpRegularValores> {
  constructor(private service: ExpRegularValoresService) {
    super("ExpRegularValores", service);
  }
  //nuevos asyncthunks aqui
}
export const ExpRegularValoresSlice = new expRegularValoresClassSlice(expRegularValoresService);

const initialState: IIniState<IExpRegularValores> = {
  loading: null,
  data: null
};

export const expRegularValoresSlice = createSlice({
  name: "ExpRegularValores",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ExpRegularValoresSlice.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
