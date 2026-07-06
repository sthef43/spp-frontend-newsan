import { IContPlanta } from "app/models/IContPlanta";
import { ContPlantaService } from "app/services/contPlanta.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const contPlantaService = new ContPlantaService();
class contPlantaClassSlice extends GenericSlice<IContPlanta> {
  constructor(private service: ContPlantaService) {
    super("ContPlanta", service);
  }
  //nuevos asyncthunks aqui
}
export const ContPlantaSliceRequests = new contPlantaClassSlice(contPlantaService);

const initialState: IIniState<IContPlanta> = {
  loading: null,
  data: null
};

export const contPlantaSlice = createSlice({
  name: "ContPlanta",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContPlantaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
