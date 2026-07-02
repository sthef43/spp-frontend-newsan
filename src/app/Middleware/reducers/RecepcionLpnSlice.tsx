import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IRecepcionLpn } from "app/models/IRecepcionLpn";
import { RecepcionLpnService } from "app/services/RecepcionLpn.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";

const recepcionLpnService = new RecepcionLpnService()
class recepcionLpnClassSlice extends GenericSlice<IRecepcionLpn> {
    constructor(private service: RecepcionLpnService) {
        super("RecepcionLpn", service)
    }

    GetRecepcionByLpn = createAsyncThunk<IRecepcionLpn, string>("RecepcionLpn/GetRecepcionByLpn", async (codigoLpn, info) => {
        return await errorNotification(() => this.service.GetRecepcionByLpn(codigoLpn), info)
    })

    SearchRecepcionByLpn = createAsyncThunk<IRecepcionLpn, string>("RecepcionLpn/SearchRecepcionByLpn", async (codigoLpn, info) => {
        return await errorNotification(() => this.service.SearchRecepcionByLpn(codigoLpn), info)
    })

    GetAllByRecepcionado = createAsyncThunk<IRecepcionLpn[]>("RecepcionLpn/GetAllByRecepcionado", async (x, info) => {
        return await errorNotification(() => this.service.GetAllByRecepcionado(), info)
    })
}

export const RecepcionLpnSliceRequest = new recepcionLpnClassSlice(recepcionLpnService)

const initialState: IIniState<IRecepcionLpn> = {
    loading: null,
    data: null,
    object: null,
    dataAll: []
}

export const RecepcionLpnSlice = createSlice({
    name: "RecepcionLpn",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        RecepcionLpnSliceRequest.builderAll(builder)
    }
})