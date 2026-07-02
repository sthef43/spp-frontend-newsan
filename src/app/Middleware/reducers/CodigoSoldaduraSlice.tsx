import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { CodigoSoldaduraService } from "app/services/codigoSoldadura.service";
import { ICodigoSoldadura } from "app/models/ICodigoSoldadura";

const codigoSoldaduraService = new CodigoSoldaduraService();
class CodigoSoldaduraClass {
  url = "CodigoSoldadura";
  constructor(private service: CodigoSoldaduraService) {}
  GetAllRequest = createAsyncThunk<ICodigoSoldadura[]>(`${this.url}/getAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAll(), thunk);
  });
  GetListByGenericoRequest = createAsyncThunk<ICodigoSoldadura[], string>(
    `${this.url}/getListByGenerico`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getListByGenerico(info), thunk);
    }
  );
  PostRequest = createAsyncThunk<boolean, ICodigoSoldadura>(`${this.url}/Post`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  PutRequest = createAsyncThunk<boolean, ICodigoSoldadura>(`${this.url}/Put`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  DeleteRequest = createAsyncThunk<boolean, number>(`${this.url}/Delete`, async (id, info) => {
    return await errorNotification(() => this.service.deleteRequest(id), info);
  });
    UploadImagenRequest = createAsyncThunk<string, { generico; puesto; imageFile }>(
    `CodigoSoldadura/UploadImagen`,

    async (x, info) => {
      return await errorNotification(() => this.service.UploadImagen(x.generico,x.puesto, x.imageFile), info);
    }
  );
}
export const CodigoSoldaduraSliceRequests = new CodigoSoldaduraClass(codigoSoldaduraService);

// const initialState: IIniState<ICodigoSoldadura> = {
//   loading: null,
//   data: null
// };

// export const codigoSoldaduraSlice = createSlice({
//   name: "CodigoSoldadura",
//   initialState: initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     CodigoSoldaduraSliceRequests.builderAll(builder);
//     //nuevos manejos de asyncthunk aqui
//   }
// });
