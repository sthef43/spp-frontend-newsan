/* eslint-disable unused-imports/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IOpcionSlices } from "../models/IOpciontSlices";

export interface optionalStates<T> extends IIniState<IOpcionSlices> {
    estadoEdicion: boolean
    tipoFiltrado: string
}

const initialState: optionalStates<IOpcionSlices> = {
    loading: null,
    data: null,
    dataAll: [],
    object: null,
    estadoEdicion: false,
    tipoFiltrado: ""

}

export const OptionalStatesSlice = createSlice({
    name: "OptionalStatesSlice",
    initialState: initialState,
    reducers: {
        setOpcionFiltrado: (state, action: PayloadAction<string>) => {
            state.tipoFiltrado = action.payload
        },
        setOpcionFiltradoEmpty: (state, action: PayloadAction<string>) => {
            state.tipoFiltrado = action.payload
        }
    }
})