import { IDobProveedor } from "app/models/IDobProveedor";
import { DobProveedorService } from "app/services/dobProveedor.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobProveedorService = new DobProveedorService();
class dobProveedorClassSlice extends GenericSlice<IDobProveedor> {
  constructor(private service: DobProveedorService) {
    super("DobProveedor", service);
  }
  //nuevos asyncthunks aqui
}
export const DobProveedorSliceRequests = new dobProveedorClassSlice(dobProveedorService);

const initialState: IIniState<IDobProveedor> = {
  loading: null,
  data: null
};

export const dobProveedorSlice = createSlice({
  name: "DobProveedor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobProveedorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
