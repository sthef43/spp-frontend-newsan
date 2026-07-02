import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IDotacionGrupoSectoresBloque } from "../models/IDotacionGrupoSectoresBloque";
import { DotacionGrupoSectoresBloqueService } from "../services/DotacionGrupoSectoresBloque.service";

const IDotacionGrupoSectoresBloqueService = new DotacionGrupoSectoresBloqueService();

class IDotacionGrupoSectoresBloqueClassSlice extends GenericSlice<IDotacionGrupoSectoresBloque> {
  constructor(private service: DotacionGrupoSectoresBloqueService) {
    super("DotacionGrupoSectoresBloque", service);
  }

  PostNewBloq = createAsyncThunk<boolean[], { sectorId; grupoId }>(
    `DotacionGrupoSectoresBloque/PostNewBloq`,
    async ({ sectorId, grupoId }, info) => {
      return await errorNotification(() => this.service.PostNewBloq(sectorId, grupoId), info);
    }
  );

  DeleteBloqBySectorAndGrupoId = createAsyncThunk<boolean[], { sectorId; grupoId }>(
    `DotacionGrupoSectoresBloque/DeleteBloqBySectorAndGrupoId`,
    async ({ sectorId, grupoId }, info) => {
      return await errorNotification(() => this.service.DeleteBloqBySectorAndGrupoId(sectorId, grupoId), info);
    }
  );
}

export const DotacionGrupoSectoresBloqueSliceRequest = new IDotacionGrupoSectoresBloqueClassSlice(
  IDotacionGrupoSectoresBloqueService
);

const inititalState: IIniState<IDotacionGrupoSectoresBloque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const dotacionGrupoSectoresBloque = createSlice({
  name: "DotacionGrupoSectoresBloque",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    DotacionGrupoSectoresBloqueSliceRequest.builderAll(builder);
  }
});
