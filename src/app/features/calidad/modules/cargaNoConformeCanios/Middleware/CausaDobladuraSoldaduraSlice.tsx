import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ICausaDobladuraSoldadura } from "../Models/ICausaDobladuraSoldadura";
import { CausaDobladuraSoldaduraService } from "../Services/causaDobladuraSoldadura.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { IGrupoFalla } from "../Models/IGrupoFalla";

const causaDobladuraSoldaduraService = new CausaDobladuraSoldaduraService();

/**
 * Slice de Redux para gestionar el catálogo de Causas de Dobladura/Soldadura.
 * Provee acciones para buscar causas por grupo de falla.
 */
class CausaDobladuraSoldaduraClassSlice extends GenericSlice<ICausaDobladuraSoldadura> {
  constructor(private service: CausaDobladuraSoldaduraService) {
    super("CausaDobladuraSoldadura", service);
  }

  /**
   * Obtiene todas las causas asociadas a un ID de grupo de falla específico.
   * @param grupoFallaId ID del grupo de falla
   */
  GetAllCausesByFailGroupId = createAsyncThunk<IGrupoFalla[], number>(
    `CausaDobladuraSoldadura/GetAllCausesByFailGroupId`,
    async (grupoFallaId, info) => {
      return await errorNotification(() => this.service.GetAllCausesByFailGroupId(grupoFallaId), info);
    }
  );
}

export const CausaDobladuraSoldaduraSliceRequest = new CausaDobladuraSoldaduraClassSlice(
  causaDobladuraSoldaduraService
);

const inititalState: IIniState<ICausaDobladuraSoldadura> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const CausaDobladuraSoldaduraSlice = createSlice({
  name: "CausaDobladuraSoldadura",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    CausaDobladuraSoldaduraSliceRequest.builderAll(builder);
  }
});
