import { IAuditCriterio } from "app/models/IAuditCriterio";
import { IIniState } from "app/models/IIniState";
import { AuditCriterioService } from "../services/auditCriterio.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const auditCriterioService = new AuditCriterioService();
class auditCriterioClassSlice extends GenericSlice<IAuditCriterio> {
  constructor(private service: AuditCriterioService) {
    super("AuditCriterio", service);
  }
  //nuevos asyncthunks aqui
}
export const AuditCriterioSliceRequests = new auditCriterioClassSlice(auditCriterioService);

const initialState: IIniState<IAuditCriterio> = {
  loading: null,
  data: null
};

export const auditCriterioSlice = createSlice({
  name: "AuditCriterio",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditCriterioSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
