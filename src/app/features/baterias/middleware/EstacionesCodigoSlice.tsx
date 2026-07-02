import { IEstacionesCodigo } from "app/features/baterias/models/IEstacionesCodigo";
import { IIniState } from "app/models/IIniState";
import { EstacionesCodigoService } from "app/features/baterias/services/estacionesCodigo.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
//<IAuth, IAuthUser>
const estacionesCodigoService = new EstacionesCodigoService();
class estacionesCodigoClassSlice extends GenericSlice<IEstacionesCodigo> {
  constructor(private service: EstacionesCodigoService) {
    super("EstacionesCodigo", service);
  }
  //nuevos asyncthunks aqui
}
export const EstacionesCodigoSliceRequests = new estacionesCodigoClassSlice(estacionesCodigoService);

const initialState: IIniState<IEstacionesCodigo> = {
  loading: null,
  data: null
};

export const estacionesCodigoSlice = createSlice({
  name: "EstacionesCodigo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EstacionesCodigoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
