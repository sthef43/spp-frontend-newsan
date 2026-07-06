import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IIntRecepcionBloq } from "../../models/IIntRecepcionBloq";
import { IntRecepcionBloqService } from "../../services/intRecepcionBloq.service";

const intRecepcionBloqService = new IntRecepcionBloqService()

class IntRecepcionBloqClassSlice extends GenericSlice<IIntRecepcionBloq> {
    constructor(private service: IntRecepcionBloqService) {
        super('IntRecepcionBloq', service)
    }
}

export const IntRecepcionBloqSliceRequest = new IntRecepcionBloqClassSlice(intRecepcionBloqService)

const inititalState: IIniState<IIntRecepcionBloq> = {
    loading: null,
    data: null,
    dataAll: [],
    object: null,
}

export const IntRecepcionBloq = createSlice({
    name: 'IntRecepcionBloq',
    initialState: inititalState,
    reducers: {
    },
    extraReducers: (builder) => {
        IntRecepcionBloqSliceRequest.builderAll(builder)
    }
})