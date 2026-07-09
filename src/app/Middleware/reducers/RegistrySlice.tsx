import { IRegistry } from "app/models/IRegistry";
import { RegistryService } from "app/services/registry.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IPagedPaginator } from "app/models/IPagedPaginator";

const registryService = new RegistryService();
class registryClassSlice extends GenericSlice<IRegistry> {
  constructor(private service: RegistryService) {
    super("Registry", service);
  }
  getbyRolId = createAsyncThunk<IRegistry[], number>(
    `Registry/getbyRolId`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.getbyRolId(modelo), info);
    }
  );
  getPaginationbyRolId = createAsyncThunk<
    IPagedPaginator<IRegistry>,
    { pag: number; count: number; rolId: number; search: string }
  >(
    `Registry/getPaginatedbyRolId`,

    async (modelo, info) => {
      return await errorNotification(
        () => this.service.getPaginatedbyRolId(modelo.pag, modelo.count, modelo.rolId, modelo.search),
        info
      );
    }
  );
}
export const RegistrySliceRequests = new registryClassSlice(registryService);

const initialState: IIniState<IRegistry> = {
  loading: null,
  data: null,
  PaginatorData: null
};

export const registrySlice = createSlice({
  name: "Registry",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RegistrySliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(RegistrySliceRequests.getbyRolId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(RegistrySliceRequests.getbyRolId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(RegistrySliceRequests.getPaginationbyRolId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.PaginatorData = action.payload;
    });
    builder.addCase(RegistrySliceRequests.getPaginationbyRolId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
