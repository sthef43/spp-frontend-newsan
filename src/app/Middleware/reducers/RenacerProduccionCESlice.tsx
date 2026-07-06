import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IRenacerProduccionCE } from "app/models/IRenacerProduccionCE";
import { RenacerProduccionCEService } from "app/services/renacerProduccionCE.service";
import { GenericSlice } from "./genericSlice";

const renacerProduccionCEService = new RenacerProduccionCEService()
class renacerProduccionCEClassSlice extends GenericSlice<IRenacerProduccionCE> {
    constructor(private service: RenacerProduccionCEService) {
        super("RenacerProduccionCE", service)
    }
}
export const RenacerProduccionCESliceRequest = new renacerProduccionCEClassSlice(renacerProduccionCEService)

const initialState: IIniState<IRenacerProduccionCE> = {
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
        RenacerProduccionCESliceRequest.builderAll(builder)
    }
})