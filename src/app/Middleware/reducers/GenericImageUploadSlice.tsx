import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericImageUploadService } from "app/services/genericImageUpload.service";
//<IAuth, IAuthUser>
const genericImageUploadService = new GenericImageUploadService();
class GenericImageUploadClassSlice {
  constructor(private service: GenericImageUploadService) {}
  //Nuevos endpoints que no heredan de generic
  upload = createAsyncThunk<string, { file; nameFile; stringConcatenation }>(
    `GenericImageUpload/UploadImage`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.upload(info), thunk);
    }
  );
  uploadServer = createAsyncThunk<string, { file; nameFile }>(
    `GenericImageUploadServer/UploadImageServer`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.uploadServer(info), thunk);
    }
  );
}
export const GenericImageUploadSliceRequests = new GenericImageUploadClassSlice(genericImageUploadService);
const initialState: IIniState<string> = {
  loading: null,
  dataAll: [],
  data: null
};
export const GenericImageUploadSlice = createSlice({
  name: "GenericImageUpload",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
