import { IAuditBloq } from "app/models/IAuditBloq";
import { IIniState } from "app/models/IIniState";
import { AuditBloqService } from "../services/auditBloq.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";

const auditBloqService = new AuditBloqService();
class auditBloqClassSlice extends GenericSlice<IAuditBloq> {
  constructor(private service: AuditBloqService) {
    super("AuditBloq", service);
  }
  //nuevos asyncthunks aqui
  Upload = createAsyncThunk<boolean, { bloqName; imageFile; id }>(
    `AuditBloq/upload`,

    async (x, info) => {
      return await errorNotification(() => this.service.Upload(x.bloqName, x.id, x.imageFile), info);
    }
  );
}
export const AuditBloqSliceRequests = new auditBloqClassSlice(auditBloqService);

const initialState: IIniState<IAuditBloq> = {
  loading: null,
  data: null
};

export const auditBloqSlice = createSlice({
  name: "AuditBloq",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditBloqSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
