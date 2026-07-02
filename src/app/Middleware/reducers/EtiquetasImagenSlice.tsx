import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import { EtiquetasImagenService } from "app/services/etiquetasImagen.service";

const etiquetasImagenService = new EtiquetasImagenService();
class etiquetasImagenClassSlice extends GenericSlice<IEtiquetasImagen> {
    constructor(private service: EtiquetasImagenService) {
        super("EtiquetasImagen", service);
    }
    Upload = createAsyncThunk<boolean, { modelo; imageFile; tipoDeEtiqueta }>(
        `EtiquetasImagen/GetAllRequest`,

        async (x, info) => {
            return await errorNotification(() => this.service.Upload(x.modelo, x.tipoDeEtiqueta, x.imageFile), info);
        }
    );
    UploadImagesCalidad = createAsyncThunk<boolean, { modelo; imageFile; tipoDeEtiqueta; codigoEtiqueta; }>(
        `EtiquetasImagen/GetAllRequest`,

        async (x, info) => {
            return await errorNotification(() => this.service.UploadImagesCalidad(x.modelo, x.tipoDeEtiqueta, x.codigoEtiqueta, x.imageFile), info);
        }
    );
    getByModelo = createAsyncThunk<boolean, { modelo; tipoDeEtiqueta }>(
        `MaterialesImagen/getByModelo`,

        async (x, info) => {
            return await errorNotification(() => this.service.getByModelo(x.modelo, x.tipoDeEtiqueta), info);
        }
    );
    getByModelAndCodelabel = createAsyncThunk<IEtiquetasImagen, { modelo; codigoEtiqueta }>(
        `MaterialesImagen/getByModelAndCodelabel`,

        async (x, info) => {
            return await errorNotification(() => this.service.getByModelAndCodelabel(x.modelo, x.codigoEtiqueta), info);
        }
    );
    getAllTipoEtiquetas = createAsyncThunk<IEtiquetasImagen[]>(
        `MaterialesImagen/getAllTipoEtiquetas`,

        async (x, info) => {
            return await errorNotification(() => this.service.getAllTipoEtiquetas(), info);
        }
    );
    getAllCodigosEtiquetas = createAsyncThunk<IEtiquetasImagen[]>(
        `MaterialesImagen/getAllCodigosEtiquetas`,

        async (x, info) => {
            return await errorNotification(() => this.service.getAllCodigosEtiquetas(), info);
        }
    );
    getAllByModelo = createAsyncThunk<IEtiquetasImagen[], string>(
        `MaterialesImagen/getAllByModelo`,

        async (x, info) => {
            return await errorNotification(() => this.service.getAllByModelo(x), info);
        }
    );
    //nuevos asyncthunks aqui
}
export const EtiquetasImagenSliceRequests = new etiquetasImagenClassSlice(etiquetasImagenService);

const initialState: IIniState<IEtiquetasImagen> = {
    loading: null,
    data: null
};

export const materialesImagenSlice = createSlice({
    name: "MaterialesImagen",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        EtiquetasImagenSliceRequests.builderAll(builder);
        //nuevos manejos de asyncthunk aqui
        builder.addCase(EtiquetasImagenSliceRequests.getByModelo.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.data = action.payload;
        });
        builder.addCase(EtiquetasImagenSliceRequests.getByModelo.rejected, (state, action) => {
            state.loading = "rejected";
        });
        builder.addCase(EtiquetasImagenSliceRequests.getByModelAndCodelabel.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.data = action.payload;
        });
        builder.addCase(EtiquetasImagenSliceRequests.getByModelAndCodelabel.rejected, (state, action) => {
            state.loading = "rejected";
        });
        builder.addCase(EtiquetasImagenSliceRequests.getAllByModelo.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.dataAll = action.payload;
        });
        builder.addCase(EtiquetasImagenSliceRequests.getAllByModelo.rejected, (state, action) => {
            state.loading = "rejected";
        });
        builder.addCase(EtiquetasImagenSliceRequests.getAllTipoEtiquetas.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.dataAll = action.payload;
        });
        builder.addCase(EtiquetasImagenSliceRequests.getAllTipoEtiquetas.rejected, (state, action) => {
            state.loading = "rejected";
        });
        builder.addCase(EtiquetasImagenSliceRequests.getAllCodigosEtiquetas.fulfilled, (state, action) => {
            state.loading = "fulfilled";
            state.dataAll = action.payload;
        });
        builder.addCase(EtiquetasImagenSliceRequests.getAllCodigosEtiquetas.rejected, (state, action) => {
            state.loading = "rejected";
        });
    }
});
