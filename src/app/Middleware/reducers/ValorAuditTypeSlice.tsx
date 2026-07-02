import { IValorAuditType } from "app/models/IValorAuditType";
import { ValorAuditTypeService } from "app/services/valorAuditType.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const valorAuditTypeService = new ValorAuditTypeService();
class valorAuditTypeClassSlice extends GenericSlice<IValorAuditType> {
  constructor(private service: ValorAuditTypeService) {
    super("ValorAuditType", service);
  }
  //nuevos asyncthunks aqui
}
export const ValorAuditTypeSliceRequests = new valorAuditTypeClassSlice(valorAuditTypeService);

const initialState: IIniState<IValorAuditType> = {
  loading: null,
  data: null
};

export const valorAuditTypeSlice = createSlice({
  name: "ValorAuditType",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ValorAuditTypeSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
