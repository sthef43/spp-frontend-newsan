import { IIniState } from "app/models/IIniState";
import { ILocation } from "app/models/ILocation";
import { LocationService } from "app/services/location.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const locationService = new LocationService();
class locationClassSlice extends GenericSlice<ILocation> {
  constructor(private service: LocationService) {
    super("Location", service);
  }
  //nuevos asyncthunks aqui
}
export const LocationSliceRequests = new locationClassSlice(locationService);

const initialState: IIniState<ILocation> = {
  loading: null,
  data: null
};

export const locationSlice = createSlice({
  name: "Location",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    LocationSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
