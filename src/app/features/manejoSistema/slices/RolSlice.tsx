import { IRol } from "app/models/IRol";
import { RolService } from "app/features/manejoSistema/services/rol.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";

const rolService = new RolService();
class rolClassSlice extends GenericSlice<IRol> {
  constructor(private service: RolService) {
    super("Rol", service);
  }
  //nuevos asyncthunks aqui
}
export const RolSliceRequests = new rolClassSlice(rolService);

const initialState: IIniState<IRol> = {
  loading: null,
  data: null
};

export const rolSlice = createSlice({
  name: "Rol",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RolSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
