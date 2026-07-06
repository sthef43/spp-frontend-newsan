import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { SubTipoService } from "app/services/SubTipo.service";
import { ISubTipo } from "app/models/ISubTipo";

const subTipoService = new SubTipoService();
class subTipoClassService extends GenericSlice<ISubTipo> {
  constructor(private service: SubTipoService) {
    super("SubTipo", service);
  }
  //nuevos asyncthunks aqui
}
export const SubTipoSliceRequests = new subTipoClassService(subTipoService);

const initialState: IIniState<ISubTipo> = {
  loading: null,
  data: null
};

export const subTipoSlice = createSlice({
  name: "SubTipo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SubTipoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
