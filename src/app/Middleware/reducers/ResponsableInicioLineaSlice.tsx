import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IResponsableInicioLinea } from "app/models/IResponsableInicioLinea";
import { ResponsableInicioLineaService } from "app/services/responsableInicioLinea";

const responsableInicioLineaService = new ResponsableInicioLineaService();

class ResponsableInicioLineaClassSlice {
  constructor(private service: ResponsableInicioLineaService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<IResponsableInicioLinea, number>(
    `ResponsableInicioLinea/GetById`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByIdRequest(modelo), info);
    }
  );

  getAllRequest = createAsyncThunk<IResponsableInicioLinea[]>(`IResponsableInicioLinea/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllRequest(), thunk);
  });

  putRequest = createAsyncThunk<boolean, IResponsableInicioLinea>(
    `IResponsableInicioLinea/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IResponsableInicioLinea, IResponsableInicioLinea>(
    `IResponsableInicioLinea/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PostRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `IResponsableInicioLinea/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
}
export const ResponsableInicioLineaSliceRequests = new ResponsableInicioLineaClassSlice(responsableInicioLineaService);

const initialState: IIniState<IResponsableInicioLinea> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PlanProdSlice = createSlice({
  name: "ResponsableInicioLinea",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ResponsableInicioLineaSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ResponsableInicioLineaSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
