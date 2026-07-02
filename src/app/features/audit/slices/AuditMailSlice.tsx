import { IAuditMail } from "app/models/IAuditMail";
import { IIniState } from "app/models/IIniState";
import { AuditMailService } from "app/services/auditMail.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const auditMailService = new AuditMailService();
class auditMailClassSlice extends GenericSlice<IAuditMail> {
  constructor(private service: AuditMailService) {
    super("AuditMail", service);
  }
  //nuevos asyncthunks aqui
}
export const AuditMailSliceRequests = new auditMailClassSlice(auditMailService);

const initialState: IIniState<IAuditMail> = {
  loading: null,
  data: null
};

export const auditMailSlice = createSlice({
  name: "AuditMail",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditMailSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
