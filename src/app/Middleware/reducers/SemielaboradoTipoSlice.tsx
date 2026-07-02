import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ISemielaboradoTipo } from "app/models/ISemielaboradoTipo";
import { SemielaboradoTipoService } from "app/services/semielaboradoTipo.servive";

const semielaboradoTipoService = new SemielaboradoTipoService();
class semielaboradoTipoClassSlice extends GenericSlice<ISemielaboradoTipo> {
  constructor(private service: SemielaboradoTipoService) {
    super("SemielaboradoTipo", service);
  }
  //nuevos asyncthunks aqui
}
export const SemielaboradoTipoSliceRequests = new semielaboradoTipoClassSlice(semielaboradoTipoService);

const initialState: IIniState<ISemielaboradoTipo> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const semielaboradoTipoSlice = createSlice({
  name: "SemielaboradoTipo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SemielaboradoTipoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
