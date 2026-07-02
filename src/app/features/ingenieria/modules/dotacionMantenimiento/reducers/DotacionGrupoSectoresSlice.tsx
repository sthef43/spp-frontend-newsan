import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IDotacionGrupoSectores } from "../models/IDotacionGrupoSectores";
import { DotacionGrupoSectoresService } from "../services/DotacionGruposSectores.service";

const dotacionGrupoSectoresService = new DotacionGrupoSectoresService();

class dotacionGrupoSectoresClassSlice extends GenericSlice<IDotacionGrupoSectores> {
  constructor(private service: DotacionGrupoSectoresService) {
    super("DotacionGrupoSectores", service);
  }

  GetGroupsByPlantAndLineId = createAsyncThunk<IDotacionGrupoSectores[], { lineaProduccionId; plantaId }>(
    `DotacionGrupoTareas/GetGroupsByPlantAndLineId`,
    async ({ lineaProduccionId, plantaId }, info) => {
      return await errorNotification(() => this.service.GetGroupsByPlantAndLineId(lineaProduccionId, plantaId), info);
    }
  );

  GetAllWithGroup = createAsyncThunk<IDotacionGrupoSectores[], number>(
    `DotacionGrupoTareas/GetAllWithGroup`,
    async (grupoId, info) => {
      return await errorNotification(() => this.service.GetAllWithGroup(grupoId), info);
    }
  );

  GetFirstGroupByPlantAndLineId = createAsyncThunk<IDotacionGrupoSectores, { lineaProduccionId; plantaId }>(
    `DotacionGrupoSectores/GetFirstGroupByPlantAndLineId`,
    async ({ lineaProduccionId, plantaId }, info) => {
      return await errorNotification(
        () => this.service.GetFirstGroupByPlantAndLineId(lineaProduccionId, plantaId),
        info
      );
    }
  );
}

export const DotacionGrupoSectoresSliceRequest = new dotacionGrupoSectoresClassSlice(dotacionGrupoSectoresService);

const inititalState: IIniState<IDotacionGrupoSectores> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const dotacionGrupoSectores = createSlice({
  name: "DotacionGrupoSectores",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    DotacionGrupoSectoresSliceRequest.builderAll(builder);
  }
});
