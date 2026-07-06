import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { ILPNPuesto } from "app/models/ILPNPuesto";
import { LPNPuestoService } from "app/services/lpn-puesto.service";


const lpnPuestoService = new LPNPuestoService();


class lpnPuestoClassSlice extends GenericSlice<ILPNPuesto> {

  constructor(private service: LPNPuestoService) {
    super("ListaValores", service);
  }
  //nuevos asyncthunks aqui
}
export const LPNPuestoSliceRequests = new lpnPuestoClassSlice(lpnPuestoService);

const initialState: IIniState<ILPNPuesto> = {
  loading: null,
  data: null
};

export const listaValoresSlice = createSlice({
  name: "ListaValores",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    LPNPuestoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
