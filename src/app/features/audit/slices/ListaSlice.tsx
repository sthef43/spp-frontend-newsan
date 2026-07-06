import { IIniState } from "app/models/IIniState";
import { ILista } from "app/models/ILista";
import { ListaService } from "../services/lista.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const listaService = new ListaService();
class listaClassSlice extends GenericSlice<ILista> {
  constructor(private service: ListaService) {
    super("Lista", service);
  }
  //nuevos asyncthunks aqui
}
export const ListaSliceRequests = new listaClassSlice(listaService);

const initialState: IIniState<ILista> = {
  loading: null,
  data: null
};

export const listaSlice = createSlice({
  name: "Lista",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ListaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
