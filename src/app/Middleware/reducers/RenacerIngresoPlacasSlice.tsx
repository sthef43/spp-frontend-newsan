import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IRenacerIngresoPlacas } from "app/models/IRenacerIngresoPlacas";
import { RenacerIngresoPlacasService } from "app/services/renacerIngresoPlacas.service";
import { GenericSlice } from "./genericSlice";

const renacerIngresoPlacasService = new RenacerIngresoPlacasService()
class renacerIngresoPlacasClassSlice extends GenericSlice<IRenacerIngresoPlacas> {
    constructor(private service: RenacerIngresoPlacasService) {
        super("RenacerIngresoPlacas", service)
    }
}
export const RenacerIngresoPlacaSliceRequest = new renacerIngresoPlacasClassSlice(renacerIngresoPlacasService)

const initialState: IIniState<IRenacerIngresoPlacas> = {
    loading: null,
    data: null,
    object: null,
    dataAll: []
}

export const RenacerIngresoPlacasSlice = createSlice({
    name: "RenacerIngresoPlacas",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        RenacerIngresoPlacaSliceRequest.builderAll(builder)
    }
})