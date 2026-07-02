import { IXXE_WIP_CONTROL_SERIALES } from "app/models/IXXE_WIP_CONTROL_SERIALES";
import { IIniState } from "app/models/IIniState";
import { XXE_WIP_CONTROL_SERIALESService } from "app/services/xxe_wip_control_seriales.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const xxe_wip_control_serialesService = new XXE_WIP_CONTROL_SERIALESService();

class XXE_WIP_CONTROL_SERIALESClassSlice {
  constructor(private service: XXE_WIP_CONTROL_SERIALESService) {}
  //Nuevos endpoints que no heredan de generic
  getAllByCodigoModeloRequest = createAsyncThunk<
    IXXE_WIP_CONTROL_SERIALES[],
    { codigoModelo: string; tipoUnidad: string }
  >(`XXE_WIP_CONTROL_SERIALES/GetAllByCodigoModelo`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByCodigoModeloRequest(modelo), info);
  });
  getByCodigoModelo = createAsyncThunk<IXXE_WIP_CONTROL_SERIALES[], string>(
    `XXE_WIP_CONTROL_SERIALES/GetByCodigoModelo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByCodigoModelo(modelo), info);
    }
  );
  
  // GetByOrganizationCodeItem(string organizationCode, string item)
  getByOrganizationCodeItemRequest = createAsyncThunk<IXXE_WIP_CONTROL_SERIALES[], {organizationCode; item}>(
    `XXE_WIP_CONTROL_SERIALES/getByOrganizationCodeItemRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByOrganizationCodeItem(modelo), info);
    }
  );


}
export const XXE_WIP_CONTROL_SERIALESSliceRequests = new XXE_WIP_CONTROL_SERIALESClassSlice(
  xxe_wip_control_serialesService
);

const initialState: IIniState<IXXE_WIP_CONTROL_SERIALES> = {
  loading: null,
  data: null
};

export const XXE_WIP_CONTROL_SERIALESSlice = createSlice({
  name: "XXE_WIP_CONTROL_SERIALES",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(XXE_WIP_CONTROL_SERIALESSliceRequests.getAllByCodigoModeloRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(XXE_WIP_CONTROL_SERIALESSliceRequests.getAllByCodigoModeloRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
