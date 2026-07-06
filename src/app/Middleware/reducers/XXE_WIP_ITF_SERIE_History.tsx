import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IXXE_WIP_ITF_SERIE_History } from "../../models/IXXE_WIP_ITF_SERIE_History";
import { XXE_WIP_ITF_SERIE_HistoryService } from "../../services/xxe_wip_itf_serie_history.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const xxe_wip_itf_serie_historyService = new XXE_WIP_ITF_SERIE_HistoryService()

class XXE_WIP_ITF_SERIE_HistoryClassSlice {
    constructor(private service: XXE_WIP_ITF_SERIE_HistoryService) { }
    GetByLpn = createAsyncThunk<IXXE_WIP_ITF_SERIE_History[], string>(
        `XXE_WIP_ITF_SERIE_History/GetByLpn`, async (lpn, info) => {
            return await errorNotification(() => this.service.GetByLpn(lpn), info)
        }
    )
}

export const XXE_WIP_ITF_SERIE_HistorySliceRequest = new XXE_WIP_ITF_SERIE_HistoryClassSlice(xxe_wip_itf_serie_historyService)

const inititalState: IIniState<IXXE_WIP_ITF_SERIE_History> = {
    loading: null,
    data: null,
    dataAll: [],
    object: null,
}

export const XXE_WIP_ITF_SERIE_HistorySlice = createSlice({
    name: 'XXE_WIP_ITF_SERIE_History',
    initialState: inititalState,
    reducers: {
    },
    extraReducers: (builder) => {
        //Nuevos slices que no heredan de generic
    }
})