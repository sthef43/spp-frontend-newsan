import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IRenacerReparaciones } from "app/models/IRenacerReparaciones";
import { RenacerReparacionesService } from "app/services/renacerReparaciones.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";

const renacerReparacionesService = new RenacerReparacionesService()
class renacerReparacionesClassSlice extends GenericSlice<IRenacerReparaciones> {
    constructor(private service: RenacerReparacionesService) {
        super("RenacerReparaciones", service)
    }

    GetReparacionesGroupByPosicion = createAsyncThunk<IRenacerReparaciones[]>(
        `RenacerReparaciones/GetReparacionesGroupByPosicion`, async (modelo, info) => {
            return await errorNotification(() => this.service.GetReparacionesGroupByPosicion(), info)
        }
    )
}
export const RenacerReparacionesSliceRequest = new renacerReparacionesClassSlice(renacerReparacionesService)

const initialState: IIniState<IRenacerReparaciones> = {
    loading: null,
    data: null,
    object: null,
    dataAll: []
}

export const RenacerIngresoPlacasSlice = createSlice({
    name: "RenacerReparaciones",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        RenacerReparacionesSliceRequest.builderAll(builder)
    }
})