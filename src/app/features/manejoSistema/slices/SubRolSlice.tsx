import { ISubRol } from "app/models/ISubRol";
import { SubRolService } from "app/features/manejoSistema/services/subRol.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";

const subRolService = new SubRolService();
class subRolClassSlice extends GenericSlice<ISubRol> {
  constructor(private service: SubRolService) {
    super("SubRol", service);
  }
  //nuevos asyncthunks aqui
}
export const SubRolSliceRequests = new subRolClassSlice(subRolService);

const initialState: IIniState<ISubRol> = {
  loading: null,
  data: null
};

export const subRolSlice = createSlice({
  name: "SubRol",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SubRolSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
