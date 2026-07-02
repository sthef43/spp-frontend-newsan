import { IValor } from "app/models/IValor";
import { ValorService } from "app/services/valor.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const valorService = new ValorService();
class valorClassSlice extends GenericSlice<IValor> {
  constructor(private service: ValorService) {
    super("Valor", service);
  }
  //nuevos asyncthunks aqui
}
export const ValorSliceRequests = new valorClassSlice(valorService);

const initialState: IIniState<IValor> = {
  loading: null,
  data: null
};

export const valorSlice = createSlice({
  name: "Valor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ValorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
