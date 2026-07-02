import { IAuditType } from "app/models/IAuditType";
import { IIniState } from "app/models/IIniState";
import { AuditTypeService } from "app/services/auditType.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const auditTypeService = new AuditTypeService();
class areaClassSlice extends GenericSlice<IAuditType> {
  constructor(private service: AuditTypeService) {
    super("AuditType", service);
  }
  //nuevos asyncthunks aqui
}
export const AuditTypeSliceRequests = new areaClassSlice(auditTypeService);

const initialState: IIniState<IAuditType> = {
  loading: null,
  data: null
};

export const auditTypeSlice = createSlice({
  name: "AuditType",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditTypeSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
