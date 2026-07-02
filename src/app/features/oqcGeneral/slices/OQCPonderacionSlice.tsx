import { IIniState } from "app/models/IIniState";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCPonderacion } from "app/models/IOQCPonderacion";
import { OQCPonderacionService } from "app/features/oqcGeneral/services/oqcPonderacion.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcPonderacionService = new OQCPonderacionService();
class oqcPonderacionClassSlice extends GenericSlice<IOQCPonderacion> {
  constructor(private service: OQCPonderacionService) {
    super("OQCPonderacion", service);
  }
  //nuevos asyncthunks aqui
}
export const OQCPonderacionSliceRequests = new oqcPonderacionClassSlice(oqcPonderacionService);

const initialState: IIniState<IOQCPonderacion> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcPonderacionSlice = createSlice({
  name: "OQCPonderacion",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCPonderacion>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCPonderacionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
