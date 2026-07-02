import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import { OQCBloqueGroupService } from "app/features/oqcGeneral/services/oqcBloqueGroup.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcBloqueGroupService = new OQCBloqueGroupService();
class oqcBloqueGroupClassSlice extends GenericSlice<IOQCBloqueGroup> {
  constructor(private service: OQCBloqueGroupService) {
    super("OQCBloqueGroup", service);
  }
  //nuevos asyncthunks aqui
  uploadMultipleImageRequest = createAsyncThunk<boolean, Array<{ oqcBloqueGroupId: number; image: any }>>(
    "AuditRegistryImage/UploadImages",
    async (model, info) => {
      return await errorNotification(() => this.service.uploadImages(model), info);
    }
  );
}
export const OQCBloqueGroupSliceRequests = new oqcBloqueGroupClassSlice(oqcBloqueGroupService);

const initialState: IIniState<IOQCBloqueGroup> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcBloqueGroupSlice = createSlice({
  name: "OQCBloqueGroup",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCBloqueGroup>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCBloqueGroupSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
