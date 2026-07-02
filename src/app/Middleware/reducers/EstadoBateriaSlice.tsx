import { IEstadoBaterias } from "app/features/baterias/models/IEstadoBaterias";
import { IIniState } from "app/models/IIniState";
import { EstadoBateriasService } from "app/features/baterias/services/estadoBaterias.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const estadoBateriasService = new EstadoBateriasService();
class estadoBateriasClassSlice extends GenericSlice<IEstadoBaterias> {
  constructor(private service: EstadoBateriasService) {
    super("EstadoBaterias", service);
  }
  //nuevos asyncthunks aqui
}
export const EstadoBateriasSliceRequests = new estadoBateriasClassSlice(estadoBateriasService);

const initialState: IIniState<IEstadoBaterias> = {
  loading: null,
  data: null
};

export const estadoBateriasSlice = createSlice({
  name: "EstadoBaterias",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EstadoBateriasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
