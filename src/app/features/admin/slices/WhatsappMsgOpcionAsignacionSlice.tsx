/* eslint-disable unused-imports/no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IWhatsappMsgOpcionAsignacion } from "app/models/IWhatsappMsgOpcionAsignacion";
import { WhatsappMsgOpcionAsignacionService } from "../services/whatsappMsgOpcionAsignacion.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const whatsappMsgOpcionAsignacionService = new WhatsappMsgOpcionAsignacionService()

class WhatsappMsgOpcionAsignacionClassSlice extends GenericSlice<IWhatsappMsgOpcionAsignacion> {
    constructor(private service: WhatsappMsgOpcionAsignacionService) {
        super('WhatsappMsgOpcionAsignacion', service)
    }

    GetOptionsByPlantId = createAsyncThunk<IWhatsappMsgOpcionAsignacion[], number>(
        `WhatsappMsgOpcionAsignacion/GetOptionsByPlantId`, async (plantId, info) => {
            return await errorNotification(() => this.service.GetOptionsByPlantId(plantId), info)
        }
    )
}

export const WhatsappMsgOpcionAsignacionSliceRequest = new WhatsappMsgOpcionAsignacionClassSlice(whatsappMsgOpcionAsignacionService)

const inititalState: IIniState<IWhatsappMsgOpcionAsignacion> = {
    loading: null,
    data: null,
    dataAll: [],
    object: null,
}

export const WhatsappMsgOpcionAsignacionSlice = createSlice({
    name: 'WhatsappMsgOpcionAsignacion',
    initialState: inititalState,
    reducers: {
    },
    extraReducers: (builder) => {
        WhatsappMsgOpcionAsignacionSliceRequest.builderAll(builder)
        builder.addCase(WhatsappMsgOpcionAsignacionSliceRequest.GetOptionsByPlantId.fulfilled, (state, action) => {
            state.loading = "fulilled";
            state.dataAll = action.payload;
        });
        builder.addCase(WhatsappMsgOpcionAsignacionSliceRequest.GetOptionsByPlantId.rejected, (state, action) => {
            state.loading = "rejected";
        });
    }
})