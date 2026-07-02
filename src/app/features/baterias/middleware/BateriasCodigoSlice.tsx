import { IBateriasCodigo } from "app/features/baterias/models/IBateriasCodigo";
import { IIniState } from "app/models/IIniState";
import { BateriasCodigoService } from "app/features/baterias/services/bateriasCodigo.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const bateriasCodigoService = new BateriasCodigoService();
class bateriasCodigoClassSlice extends GenericSlice<IBateriasCodigo> {
  constructor(private service: BateriasCodigoService) {
    super("BateriasCodigo", service);
  }
  //nuevos asyncthunks aqui
}
export const BateriasCodigoSliceRequests = new bateriasCodigoClassSlice(bateriasCodigoService);

const initialState: IIniState<IBateriasCodigo> = {
  loading: null,
  data: null
};

export const bateriasCodigoSlice = createSlice({
  name: "BateriasCodigo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    BateriasCodigoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
