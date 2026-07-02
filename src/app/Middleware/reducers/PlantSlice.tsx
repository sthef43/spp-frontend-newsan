import { IPlant } from "app/models/IPlant";
import { PlantService } from "app/services/plant.service";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const plantService = new PlantService();
class plantClassSlice extends GenericSlice<IPlant> {
  constructor(private service: PlantService) {
    super("Plant", service);
  }
  //nuevos asyncthunks aqui
}
export const PlantSliceRequests = new plantClassSlice(plantService);

const initialState: IIniState<IPlant> = {
  loading: null,
  data: null
};

export const plantSlice = createSlice({
  name: "Plant",
  initialState: initialState,
  reducers: {
    setSelectPlant: (state, payload: PayloadAction<number>) => {
      state.object = state.dataAll?.find((plant) => plant.id == payload.payload);
    }
  },
  extraReducers: (builder) => {
    PlantSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
