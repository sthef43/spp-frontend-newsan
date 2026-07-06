import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { ICtrlPlacasHallazgos } from "app/models/ICtrlPlacasHallazgos";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { CtrlPlacasHallazgosService } from "../services/ctrlPlacasHallazgos.service";

const ctrlPlacasHallazgosService = new CtrlPlacasHallazgosService();
class ctrlPlacasHallazgosClassSlice extends GenericSlice<ICtrlPlacasHallazgos> {
  constructor(private service: CtrlPlacasHallazgosService) {
    super("CtrlPlacasHallazgos", service);
  }
  //nuevos asyncthunks aqui
}
export const CtrlPlacasHallazgosSliceRequests = new ctrlPlacasHallazgosClassSlice(ctrlPlacasHallazgosService);

const initialState: IIniState<ICtrlPlacasHallazgos> = {
  loading: null,
  data: null
};

export const ctrlPlacasHallazgosSlice = createSlice({
  name: "CtrlPlacasHallazgos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CtrlPlacasHallazgosSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
