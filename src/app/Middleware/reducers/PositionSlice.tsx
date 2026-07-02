import { IPosition } from "app/models/IPosition";
import { PositionService } from "app/services/position.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const positionService = new PositionService();
class positionClassSlice extends GenericSlice<IPosition> {
  constructor(private service: PositionService) {
    super("Position", service);
  }
  //nuevos asyncthunks aqui
}
export const PositionSliceRequests = new positionClassSlice(positionService);

const initialState: IIniState<IPosition> = {
  loading: null,
  data: null
};

export const positionSlice = createSlice({
  name: "Position",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PositionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
