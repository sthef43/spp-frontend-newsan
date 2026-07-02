import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IHora } from "app/models/IHora";
import { HoraService } from "app/services/hora.service";

const horaService = new HoraService();

class HoraClassSlice {
  constructor(private service: HoraService) {}

  getAll = createAsyncThunk<IHora[]>(`Hora/GetAll`, async (codigo, info) => {
    return await errorNotification(() => this.service.Getall(), info);
  });
  getAllByTurno = createAsyncThunk<IHora[], string>(`Hora/GetAllByTurno`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetAllByTurno(modelo), info);
  });
  postRequest = createAsyncThunk<boolean, IHora>(`Hora`, async (modelo, info) => {
    return await errorNotification(() => this.service.Post(modelo), info);
  });
  putRequest = createAsyncThunk<boolean, IHora>(`Hora`, async (modelo, info) => {
    return await errorNotification(() => this.service.PutRequest(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`Hora`, async (modelo, info) => {
    return await errorNotification(() => this.service.Delete(modelo), info);
  });
}
export const HoraSliceRequests = new HoraClassSlice(horaService);

export const HoraSlice = createSlice({
  name: "Hora",
  initialState: {
    loading: null,
    dataAll: [],
    data: null
  },
  reducers: {
    filtrarHoraPorTurno: (state, action) => {
      state.data = state.dataAll.filter((x) => x.turno == action.payload.watchTurno);
      console.log(state.data);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HoraSliceRequests.getAll.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(HoraSliceRequests.getAll.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(HoraSliceRequests.getAllByTurno.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(HoraSliceRequests.getAllByTurno.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});

export const { filtrarHoraPorTurno } = HoraSlice.actions;
