import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IOQCSupervisoresMotorola } from "app/models/IOQCSupervisoresMotorola";
import { OQCSupervisoresMotorolaService } from "../services/oqcSupervisoresMotorola.service";
const oqcSupervisoresMotorola = new OQCSupervisoresMotorolaService();

class oqcSupervisoresMotorolaClassSlice extends GenericSlice<IOQCSupervisoresMotorola> {
  constructor(private service: OQCSupervisoresMotorolaService) {
    super("OQCSupervisoresMotorola", service);
  }
  //Nuevos Asyncthunks aqui

  getAllSupervisoresByPlantId = createAsyncThunk<IOQCSupervisoresMotorola[], number>(
    "OQCSupervisoresMotorola/getAllSupervisoresByPlantId",
    async (plantId, info) => {
      return await errorNotification(() => this.service.getAllSupervisoresByPlantId(plantId), info);
    }
  );
}
export const OQCSupervisoresMotorolaSliceRequest = new oqcSupervisoresMotorolaClassSlice(oqcSupervisoresMotorola);

const initialState: IIniState<IOQCSupervisoresMotorola> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcSupervisoresMotorolaSlice = createSlice({
  name: "OQCSupervisoresMotorola",
  initialState: initialState,
  reducers: {
    setObject: (state, action: PayloadAction<IOQCSupervisoresMotorola>) => {
      state.object = action.payload;
    },
    setClear: (state) => {
      state.dataAll = [];
      state.object = null;
    }
  },
  extraReducers: (builder) => {
    OQCSupervisoresMotorolaSliceRequest.builderAll(builder);
    //Nuevos Manejos Asyncthunk Aqui
    builder.addCase(OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
