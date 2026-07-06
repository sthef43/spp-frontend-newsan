import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReprocesoLineaScService } from "../../services/reprocesoLineaSC";
import { IReprocesoLineaSC } from "../../models/IReprocesoLineaSC";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IIniState } from "../../models";
import { IReprocesoScConTraza } from "../../models/IReprocesoScConTraza";

const reprocesoLineaScService = new ReprocesoLineaScService()

class ReprocesoLineaScClassSlice {
    constructor(private service: ReprocesoLineaScService) { }
    getAllItemsWithDates = createAsyncThunk<IReprocesoLineaSC[], { fechaDesde, fechaHasta }>(
        `ReprocesoLineaSc/GetAllItemsWithDates`, async ({ fechaDesde, fechaHasta }, info) => {
            return await errorNotification(() => this.service.getAllItemsWithDates(fechaDesde, fechaHasta), info)
        }
    )
    getReprocesosWithTrazaByDate = createAsyncThunk<IReprocesoScConTraza[], { fechaDesde, fechaHasta }>(
        `ReprocesoLineaSc/getReprocesosWithTrazaByDate`, async ({ fechaDesde, fechaHasta }, info) => {
            return await errorNotification(() => this.service.getReprocesosWithTrazaByDate(fechaDesde, fechaHasta), info)
        }
    )
}

export const ReprocesoLineaScSliceRequest = new ReprocesoLineaScClassSlice(reprocesoLineaScService)

const initialState: IIniState<IReprocesoLineaSC> = {
    loading: null,
    data: null,
}

export const ReprocesoLineaScSlice = createSlice({
    name: 'ReprocesoLineaSc',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        //NUEVOS SLICES QUE NO HEREDAN LOS SLICE GENERICOS

        builder.addCase(ReprocesoLineaScSliceRequest.getReprocesosWithTrazaByDate.fulfilled, (state, action) => {
            state.loading = "fulfiled"
            state.dataAll = action.payload
        })
        builder.addCase(ReprocesoLineaScSliceRequest.getReprocesosWithTrazaByDate.rejected, (state, action) => {
            state.loading = "rejected"
        })

        builder.addCase(ReprocesoLineaScSliceRequest.getAllItemsWithDates.fulfilled, (state, action) => {
            state.loading = "fulfiled"
            state.dataAll = action.payload
        })
        builder.addCase(ReprocesoLineaScSliceRequest.getAllItemsWithDates.rejected, (state, action) => {
            state.loading = "rejected"
        })
    }
})