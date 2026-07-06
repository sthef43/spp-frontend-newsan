import { ISector } from "app/models/ISector";
import { SectorService } from "../services/sector.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";

const sectorService = new SectorService();
class sectorClassSlice extends GenericSlice<ISector> {
  constructor(private service: SectorService) {
    super("Sector", service);
  }
  //nuevos asyncthunks aqui
}
export const SectorSliceRequests = new sectorClassSlice(sectorService);

const initialState: IIniState<ISector> = {
  loading: null,
  data: null
};

export const sectorSlice = createSlice({
  name: "Sector",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SectorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
