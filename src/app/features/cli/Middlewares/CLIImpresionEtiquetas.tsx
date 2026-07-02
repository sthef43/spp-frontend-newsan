import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { ICLIImpresionEtiquetas } from "../Models/ICLIImpresionEtiquetas";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { CLIImpresionEtiquetasService } from "../Services/cliImpresionEtiquetas.service";

const cliImpresionEtiquetasService = new CLIImpresionEtiquetasService();
class cliImpresionEtiquetasClassSlice extends GenericSlice<ICLIImpresionEtiquetas> {
  constructor(private service: CLIImpresionEtiquetasService) {
    super("CLIImpresionEtiquetas", service);
  }
  //nuevos asyncthunks aqui

  GetItemByLPN = createAsyncThunk<ICLIImpresionEtiquetas, string>(
    `CLIImpresionEtiquetas/GetItemByLPN`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.GetItemByLPN(info), thunk);
    }
  );
  GetByLocalizadorId = createAsyncThunk<ICLIImpresionEtiquetas, number>(
    `CLIImpresionEtiquetas/GetByLocalizadorId`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.GetByLocalizadorId(info), thunk);
    }
  );
}
export const CLIImpresionEtiquetasSliceRequests = new cliImpresionEtiquetasClassSlice(cliImpresionEtiquetasService);

const initialState: IIniState<ICLIImpresionEtiquetas> = {
  loading: null,
  data: null
};

export const CLIEstadoSlice = createSlice({
  name: "CLIImpresionEtiquetas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CLIImpresionEtiquetasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
