import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IDotacionSector } from "../models/IDotacionSector";
import { DotacionSectorService } from "../services/DotacionSectores.service";

const dotacionSectorService = new DotacionSectorService();

class dotacionSectorClassSlice extends GenericSlice<IDotacionSector> {
  constructor(private service: DotacionSectorService) {
    super("DotacionSector", service);
  }

  GetAllWithGroup = createAsyncThunk<IDotacionSector[], number>(
    `DotacionGrupoTareas/GetAllWithGroup`,
    async (grupoId, info) => {
      return await errorNotification(() => this.service.GetAllWithGroup(grupoId), info);
    }
  );

  GetAllItemsWithoutGroup = createAsyncThunk<IDotacionSector[], number>(
    `DotacionGrupoTareas/GetAllItemsWithoutGroup`,
    async (grupoId, info) => {
      return await errorNotification(() => this.service.GetAllItemsWithoutGroup(grupoId), info);
    }
  );
}

export const DotacionSectorSliceRequest = new dotacionSectorClassSlice(dotacionSectorService);

const inititalState: IIniState<IDotacionSector> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const dotacionSector = createSlice({
  name: "DotacionSector",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    DotacionSectorSliceRequest.builderAll(builder);
  }
});
