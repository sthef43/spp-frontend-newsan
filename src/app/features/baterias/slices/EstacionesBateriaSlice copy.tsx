import { IEstacionesBateria } from "app/features/baterias/models/IEstacionesBateria";
import { IIniState } from "app/models/IIniState";
import { EstacionesBateriaService } from "app/features/baterias/services/estacionesBateria.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const estacionesBateriaService = new EstacionesBateriaService();
class estacionesBateriaClassSlice extends GenericSlice<IEstacionesBateria> {
  constructor(private service: EstacionesBateriaService) {
    super("EstacionesBateria", service);
  }
  //nuevos asyncthunks aqui
}
export const EstacionesBateriaSliceRequests = new estacionesBateriaClassSlice(estacionesBateriaService);

const initialState: IIniState<IEstacionesBateria> = {
  loading: null,
  data: null
};

export const estacionesBateriaSlice = createSlice({
  name: "EstacionesBateria",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EstacionesBateriaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
