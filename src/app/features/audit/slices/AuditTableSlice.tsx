import { IAuditTable } from "app/models/IAuditTable";
import { IIniState } from "app/models/IIniState";
import { AuditTableService } from "../services/auditTable.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const auditTableService = new AuditTableService();

class AuditTableClassSlice extends GenericSlice<IAuditTable> {
  constructor(private service: AuditTableService) {
    super("Users", service);
  }
}
export const AuditTableSliceRequests = new AuditTableClassSlice(auditTableService);

const initialState: IIniState<IAuditTable> = {
  loading: null,
  data: null
};

export const AuditTableSlice = createSlice({
  name: "AuditTable",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditTableSliceRequests.builderAll(builder);
  }
});
