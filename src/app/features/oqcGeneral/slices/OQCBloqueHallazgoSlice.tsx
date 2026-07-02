import { IIniState } from "app/models/IIniState";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { OQCBloqueHallazgoService } from "app/features/oqcGeneral/services/oqcBloqueHallazgo.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcBloqueHallazgoService = new OQCBloqueHallazgoService();
class oqcBloqueHallazgoClassSlice extends GenericSlice<IOQCBloqueHallazgo> {
  constructor(private service: OQCBloqueHallazgoService) {
    super("OQCBloqueHallazgo", service);
  }
  //nuevos asyncthunks aqui
}
export const OQCBloqueHallazgoSliceRequests = new oqcBloqueHallazgoClassSlice(oqcBloqueHallazgoService);

const initialState: IIniState<IOQCBloqueHallazgo> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcBloqueHallazgoSlice = createSlice({
  name: "OQCBloqueHallazgo",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCBloqueHallazgo>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCBloqueHallazgoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
