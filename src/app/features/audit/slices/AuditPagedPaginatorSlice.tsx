import { IAuditPagedPaginator } from "app/models/IAuditPagedPaginator";
import { IIniState } from "app/models/IIniState";
import { AuditPagedPaginatorService } from "../services/auditPagedPaginator.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const auditPagedPaginatorService = new AuditPagedPaginatorService();
class auditPagedPaginatorClassSlice extends GenericSlice<IAuditPagedPaginator> {
  constructor(private service: AuditPagedPaginatorService) {
    super("AuditPagedPaginator", service);
  }
  //nuevos asyncthunks aqui
}
export const AuditPagedPaginatorSliceRequests = new auditPagedPaginatorClassSlice(auditPagedPaginatorService);

const initialState: IIniState<IAuditPagedPaginator> = {
  loading: null,
  data: null
};

export const auditPagedPaginatorSlice = createSlice({
  name: "AuditPagedPaginator",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditPagedPaginatorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
