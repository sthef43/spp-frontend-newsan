import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { IRechazoImagen } from "app/models/IRechazoImagen";
import { RechazoImagenService } from "../services/rechazoImagen.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const rechazoImagenService = new RechazoImagenService();
class rechazoImagenClassSlice extends GenericSlice<IRechazoImagen> {
  constructor(private service: RechazoImagenService) {
    super("RechazoImagen", service);
  }
  //nuevos asyncthunks aqui
  GetAllByPuestoIdRequest = createAsyncThunk<IRechazoImagen[], number>("RechazoImagen", async (id, info) => {
    return await errorNotification(() => this.service.getAllByPuestoIdRequest(id), info);
  });
  UploadImagenRequest = createAsyncThunk<boolean, { rechazoImagenId; imageFile }>(
    `RechazoImagen/UploadImagen`,

    async (x, info) => {
      return await errorNotification(() => this.service.UploadImagen(x.rechazoImagenId, x.imageFile), info);
    }
  );
}
export const RechazoImagenSliceRequests = new rechazoImagenClassSlice(rechazoImagenService);

const initialState: IIniState<IRechazoImagen> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const RechazoImagenSlice = createSlice({
  name: "RechazoImagen",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RechazoImagenSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(RechazoImagenSliceRequests.GetAllByPuestoIdRequest.fulfilled, (state, actions) => {
      state.dataAll = actions.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(RechazoImagenSliceRequests.GetAllByPuestoIdRequest.rejected, (state, actions) => {
      state.loading = "rejected";
    });
  }
});
