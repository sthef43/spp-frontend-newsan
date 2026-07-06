import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IAuditComentario } from "app/models/IAuditComentario";
import { AuditComentarioService } from "../services/auditComentario.service";
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";

const auditComentarioService = new AuditComentarioService();
class auditComentarioClassSlice extends GenericSlice<IAuditComentario> {
  constructor(private srv: AuditComentarioService) {
    super("AuditComentario", srv);
  }
}
export const AuditComentarioSliceRequest = new auditComentarioClassSlice(auditComentarioService);

const initialState: IIniState<IAuditComentario> = {
  data: null,
  dataAll: [],
  object: null,
  loading: "",
  PaginatorData: null
};
export const AuditComentarioSlice = createSlice({
  name: "AuditComentario",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditComentarioSliceRequest.builderAll(builder);
  }
});
