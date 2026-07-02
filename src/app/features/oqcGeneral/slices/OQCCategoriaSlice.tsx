import { IIniState } from "app/models/IIniState";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { OQCCategoriaService } from "app/features/oqcGeneral/services/oqcCategoria.service";
import { IOQCCategoria } from "app/models/IOQCCategoria";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcCategoriaService = new OQCCategoriaService();
class oqcCategoriaClassSlice extends GenericSlice<IOQCCategoria> {
  constructor(private service: OQCCategoriaService) {
    super("OQCCategoria", service);
  }
  //nuevos asyncthunks aqui
}
export const OQCCategoriaSliceRequests = new oqcCategoriaClassSlice(oqcCategoriaService);

const initialState: IIniState<IOQCCategoria> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcCategoriaSlice = createSlice({
  name: "OQCCategoria",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCCategoria>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCCategoriaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
