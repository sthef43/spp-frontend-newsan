import { ITurno } from "app/models/ITurno";
import { TurnoService } from "app/services/turno.service";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const turnoService = new TurnoService();
class turnoClassSlice extends GenericSlice<ITurno> {
  constructor(private service: TurnoService) {
    super("Turno", service);
  }
  //nuevos asyncthunks aqui
  getAllWithRelationsRequest = createAsyncThunk<ITurno[]>(`Turno/GetAllWR`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllWR(), info);
  });
}
export const TurnoSliceRequests = new turnoClassSlice(turnoService);

const initialState: IIniState<ITurno> = {
  loading: null,
  data: null
};

export const turnoSlice = createSlice({
  name: "Turno",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<ITurno>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    TurnoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(TurnoSliceRequests.getAllWithRelationsRequest.fulfilled, (state, action) => {
      state.loading = "fulilled";
      state.dataAll = action.payload;
    });
    builder.addCase(TurnoSliceRequests.getAllWithRelationsRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
