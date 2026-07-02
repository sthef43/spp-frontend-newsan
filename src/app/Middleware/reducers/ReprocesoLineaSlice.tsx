import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import { IIniState } from "app/models/IIniState";
import { ReprocesoLineaService } from "app/services/reprocesoLinea.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IReprocesoLineaConTraza } from "../../models/IReprocesoConTraza";
//<IAuth, IAuthUser>
const reprocesoLineaService = new ReprocesoLineaService();

class ReprocesoLineaClassSlice {
    constructor(private service: ReprocesoLineaService) { }
    //Nuevos endpoints que no heredan de generic
    getListByControlLoteId = createAsyncThunk<IReprocesoLinea[], number>(
        `ReprocesoLinea/GetListByControlLoteId`,
        async (modelo, info) => {
            return await errorNotification(() => this.service.getListByControlLoteId(modelo), info);
        }
    );
    postRequest = createAsyncThunk<IReprocesoLinea, IReprocesoLinea>(
        `ReprocesoLinea/PostRequest`,

        async (modelo, info) => {
            return await errorNotification(() => this.service.postRequest(modelo), info);
        }
    );
    multiPostRequest = createAsyncThunk<boolean, IReprocesoLinea[]>(
        `ReprocesoLinea/MultiPostRequest`,
        async (modelo, info) => {
            console.log("slice");

            return await errorNotification(() => this.service.multiPostRequest(modelo), info);
        }
    );
    multiPutRequest = createAsyncThunk<boolean, IReprocesoLinea[]>(
        `ReprocesoLinea/MultiPutRequest`,
        async (modelo, info) => {
            return await errorNotification(() => this.service.multiPutRequest(modelo), info);
        }
    );
    getByDateRequest = createAsyncThunk<IReprocesoLinea[], { fechaDesde; fechaHasta }>(
        `ReprocesoLinea/GetByDate`,
        async ({ fechaDesde, fechaHasta }, info) => {
            return await errorNotification(() => this.service.getByDateRequest(fechaDesde, fechaHasta), info);
        }
    );
    getAllReproccesAndTraza = createAsyncThunk<IReprocesoLinea[], { fechaDesde; fechaHasta, lineaId }>(
        `ReprocesoLinea/GetAllReproccesAndTraza`,
        async ({ fechaDesde, fechaHasta, lineaId }, info) => {
            return await errorNotification(() => this.service.getAllReproccesAndTraza(fechaDesde, fechaHasta, lineaId), info);
        }
    );
    getReprocesosByLineaAndDate = createAsyncThunk<IReprocesoLineaConTraza[], { fechaDesde; fechaHasta; idLinea; }>(
        `ReprocesoLinea/getReprocesosByLineaAndDate`,
        async ({ fechaDesde, fechaHasta, idLinea }, info) => {
            return await errorNotification(() => this.service.getReprocesosByLineaAndDate(fechaDesde, fechaHasta, idLinea), info);
        }
    );
    GetAllControlLoteByListOfId = createAsyncThunk<IReprocesoLinea[], number[]>(
        `ReprocesoLinea/GetAllControlLoteByListOfId`, async (listaId, info) => {
            return await errorNotification(() => this.service.GetAllControlLoteByListOfId(listaId), info)
        }
    )
}
export const ReprocesoLineaSliceRequests = new ReprocesoLineaClassSlice(reprocesoLineaService);

const initialState: IIniState<IReprocesoLinea> = {
    loading: null,
    data: null
};

export const ReprocesoLineaSlice = createSlice({
    name: "ReprocesoLinea",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        //Nuevos slices que no heredan de generic

        builder.addCase(ReprocesoLineaSliceRequests.getListByControlLoteId.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.data = action.payload;
        });
        builder.addCase(ReprocesoLineaSliceRequests.getListByControlLoteId.rejected, (state, _action) => {
            state.loading = "rejected";
        });
        builder.addCase(ReprocesoLineaSliceRequests.multiPostRequest.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.data = action.payload;
        });
        builder.addCase(ReprocesoLineaSliceRequests.multiPostRequest.rejected, (state, _action) => {
            state.loading = "rejected";
        });
        builder.addCase(ReprocesoLineaSliceRequests.multiPutRequest.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.data = action.payload;
        });
        builder.addCase(ReprocesoLineaSliceRequests.multiPutRequest.rejected, (state, _action) => {
            state.loading = "rejected";
        });
        builder.addCase(ReprocesoLineaSliceRequests.getByDateRequest.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.dataAll = action.payload;
        });
        builder.addCase(ReprocesoLineaSliceRequests.getByDateRequest.rejected, (state, _action) => {
            state.loading = "rejected";
        });
        builder.addCase(ReprocesoLineaSliceRequests.getAllReproccesAndTraza.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.dataAll = action.payload;
        });
        builder.addCase(ReprocesoLineaSliceRequests.getAllReproccesAndTraza.rejected, (state, _action) => {
            state.loading = "rejected";
        });
        builder.addCase(ReprocesoLineaSliceRequests.getReprocesosByLineaAndDate.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.dataAll = action.payload;
        });
        builder.addCase(ReprocesoLineaSliceRequests.getReprocesosByLineaAndDate.rejected, (state, _action) => {
            state.loading = "rejected";
        });
    }
});
