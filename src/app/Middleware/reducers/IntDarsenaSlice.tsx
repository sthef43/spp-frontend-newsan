import { IIntDarsena } from "app/models/IIntDarsena";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IntDarsenaService } from "app/services/intDarsena.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const intDarsenaService = new IntDarsenaService();
class intDarsenaClassSlice extends GenericSlice<IIntDarsena> {
  constructor(private service: IntDarsenaService) {
    super("IntDarsena", service);
  }
  //nuevos asyncthunks aqui
  getAllByPlantRequest = createAsyncThunk<IIntDarsena[], number>(
    `IntDarsena/getAllByPlantRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetAllByPlant(number), info);
    }
  );
}
export const IntDarsenaSliceRequests = new intDarsenaClassSlice(intDarsenaService);

const initialState: IIniState<IIntDarsena> = {
  loading: null,
  data: null
};

export const intDarsenaSlice = createSlice({
  name: "IntDarsena",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    IntDarsenaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
