import { IAuditType } from "app/models/IAuditType";
import { IIniState } from "app/models/IIniState";
import { AuditTypeService } from "../services/auditType.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const auditTypeService = new AuditTypeService();
class areaClassSlice extends GenericSlice<IAuditType> {
  constructor(private service: AuditTypeService) {
    super("AuditType", service);
  }
  //nuevos asyncthunks aqui
  GetAllByRolIdRequest = createAsyncThunk<IAuditType[], number>("AuditType/GetAllByRolId", async (rolId, info) => {
    return await errorNotification(() => this.service.GetAllByRolId(rolId), info);
  });
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
