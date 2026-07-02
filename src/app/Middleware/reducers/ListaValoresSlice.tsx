import { IIniState } from "app/models/IIniState";
import { IListaValores } from "app/models/IListaValores";
import { ListaValoresService } from "app/services/listaValores.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const listaValoresService = new ListaValoresService();
class listaValoresClassSlice extends GenericSlice<IListaValores> {
  constructor(private service: ListaValoresService) {
    super("ListaValores", service);
  }
  //nuevos asyncthunks aqui
}
export const ListaValoresSliceRequests = new listaValoresClassSlice(listaValoresService);

const initialState: IIniState<IListaValores> = {
  loading: null,
  data: null
};

export const listaValoresSlice = createSlice({
  name: "ListaValores",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ListaValoresSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
