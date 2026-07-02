import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ProveedoresService } from "app/services/proveedores.service";
import { IProveedores } from "app/models/IProveedores";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const proveedoresService = new ProveedoresService();
class proveedoresClassSlice extends GenericSlice<IProveedores> {
  constructor(private service: ProveedoresService) {
    super("Proveedores", service);
  }
  //nuevos asyncthunks aqui
  GetAllWithOrderByName = createAsyncThunk<IProveedores[]>(
    `Proveedores/GetAllWithOrderByName`, async (id, info) => {
      return await errorNotification(() => this.service.GetAllWithOrderByName(), info)
    }
  )
  
  GetAllProveedoresByTipeUnit = createAsyncThunk<IProveedores[], string>(
    `Proveedores/GetAllProveedoresByTipeUnit`, async (typeUnit, info) => {
      return await errorNotification(() => this.service.GetAllProveedoresByTipeUnit(typeUnit), info)
    }
  )
}
export const ProveedoresSliceRequests = new proveedoresClassSlice(proveedoresService);

const initialState: IIniState<IProveedores> = {
  loading: null,
  data: null
};

export const proveedoresSlice = createSlice({
  name: "Proveedores",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ProveedoresSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
