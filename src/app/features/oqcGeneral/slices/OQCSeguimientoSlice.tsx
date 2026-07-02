import { IIniState } from "app/models/IIniState";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCSeguimiento } from "app/models/IOQCSeguimiento";
import { OQCSeguimientoService } from "app/features/oqcGeneral/services/oqcSeguimiento.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcSeguimientoService = new OQCSeguimientoService();
class oqcSeguimientoClassSlice extends GenericSlice<IOQCSeguimiento> {
  constructor(private service: OQCSeguimientoService) {
    super("OQCSeguimiento", service);
  }
  //nuevos asyncthunks aqui
}
export const OQCSeguimientoSliceRequests = new oqcSeguimientoClassSlice(oqcSeguimientoService);

const initialState: IIniState<IOQCSeguimiento> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcSeguimientoSlice = createSlice({
  name: "OQCSeguimiento",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCSeguimiento>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCSeguimientoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
