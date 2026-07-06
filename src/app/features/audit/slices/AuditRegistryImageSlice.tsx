import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";
import { AuditRegistryImageService } from "../services/auditRegistryImage.service";
import { IAuditRegistryImage } from "app/models/IAuditRegistryImage";
import { IAuditImage } from "app/models/IAuditImage";
const auditRegistryImageService = new AuditRegistryImageService();

class AuditRegistryImageClassSlice extends GenericSlice<IAuditRegistryImage> {
  constructor(private service: AuditRegistryImageService) {
    super("AuditRegistryImage", service);
  }
  uploadMultipleImageRequest = createAsyncThunk<boolean, IAuditImage[]>(
    "AuditRegistryImage/UploadImages",
    async (model, info) => {
      return await errorNotification(() => this.service.uploadImages(model), info);
    }
  );
  getImagesRequest = createAsyncThunk<IAuditRegistryImage[], { auditRegistryId: number; auditBloqId: number }>(
    "AuditRegistryImage/GetImage",
    async (id, info) => {
      return await errorNotification(() => this.service.getImage(id), info);
    }
  );
  getImageByIdsRequest = createAsyncThunk<IAuditRegistryImage, { auditRegistryId: number; auditBloqId: number }>(
    "AuditRegistryImage/GetImageByIds",
    async (id, info) => {
      return await errorNotification(() => this.service.getImageByIds(id), info);
    }
  );
}
export const AuditRegistryImageSliceRequests = new AuditRegistryImageClassSlice(auditRegistryImageService);

const initialState: IIniState<IAuditRegistryImage> = {
  loading: null,
  data: null,
  object: null
};

export const AuditRegistryImageSlice = createSlice({
  name: "AuditRegistryImage",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditRegistryImageSliceRequests.builderAll(builder);
    builder.addCase(AuditRegistryImageSliceRequests.uploadMultipleImageRequest.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditRegistryImageSliceRequests.uploadMultipleImageRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditRegistryImageSliceRequests.getImagesRequest.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditRegistryImageSliceRequests.getImagesRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditRegistryImageSliceRequests.getImageByIdsRequest.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditRegistryImageSliceRequests.getImageByIdsRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
