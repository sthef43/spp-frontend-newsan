import { IUnitMeasurement } from "app/models/IUnitMeasurement";
import { UnitMeasurementService } from "app/services/unitMeasurement.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const unitMeasurementService = new UnitMeasurementService();
class unitMeasurementClassSlice extends GenericSlice<IUnitMeasurement> {
  constructor(private service: UnitMeasurementService) {
    super("UnitMeasurement", service);
  }
  //nuevos asyncthunks aqui
}
export const UnitMeasurementSliceRequests = new unitMeasurementClassSlice(unitMeasurementService);

const initialState: IIniState<IUnitMeasurement> = {
  loading: null,
  data: null
};

export const unitMeasurementSlice = createSlice({
  name: "UnitMeasurement",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    UnitMeasurementSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
