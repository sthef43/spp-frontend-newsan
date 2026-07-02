import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ValidarSemiValorService } from "app/services/validarSemiValor.service";
import { IValidarSemiValor } from "app/models/IValidarSemiValor";

const validarSemiValorService = new ValidarSemiValorService();
class validarSemiValorClassSlice extends GenericSlice<IValidarSemiValor> {
  constructor(private service: ValidarSemiValorService) {
    super("ValidarSemiValor", service);
  }
  //nuevos asyncthunks aqui
}
export const ValidarSemiValorSliceRequests = new validarSemiValorClassSlice(validarSemiValorService);

const initialState: IIniState<IValidarSemiValor> = {
  loading: null,
  data: null
};

export const validarSemiValorSlice = createSlice({
  name: "ValidarSemiValor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ValidarSemiValorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
