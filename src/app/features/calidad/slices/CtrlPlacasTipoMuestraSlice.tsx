import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ICtrlPlacasTipoMuestra } from "../../models/ICtrlPlacasTipoMuestra";
import { CtrlPlacasTipoMuestraService } from "../../services/ctrlPlacasTipoMuestra.service";

const ctrlPlacasTipoMuestraService = new CtrlPlacasTipoMuestraService()

class CtrlPlacasTipoMuestraClassSlice extends GenericSlice<ICtrlPlacasTipoMuestra> {
    constructor(private service: CtrlPlacasTipoMuestraService) {
        super('CtrlPlacasTipoMuestra', service)
    }
}

export const CtrlPlacasTipoMuestraSliceRequest = new CtrlPlacasTipoMuestraClassSlice(ctrlPlacasTipoMuestraService)

const inititalState: IIniState<ICtrlPlacasTipoMuestra> = {
    loading: null,
    data: null,
    dataAll: [],
    object: null,
}

export const CtrlPlacasTipoMuestraSlice = createSlice({
    name: 'CtrlPlacasTipoMuestra',
    initialState: inititalState,
    reducers: {
    },
    extraReducers: (builder) => {
        CtrlPlacasTipoMuestraSliceRequest.builderAll(builder)
    }
})