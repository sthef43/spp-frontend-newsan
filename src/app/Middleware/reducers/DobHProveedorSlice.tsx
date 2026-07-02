import { IDobHProveedor } from "app/models/IDobHProveedor";
import { DobHProveedorService } from "app/services/dobHProveedor.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHProveedorService = new DobHProveedorService();
class dobHProveedorClassSlice extends GenericSlice<IDobHProveedor> {
  constructor(private service: DobHProveedorService) {
    super("DobHProveedor", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHProveedorSliceRequests = new dobHProveedorClassSlice(dobHProveedorService);

const initialState: IIniState<IDobHProveedor> = {
  loading: null,
  data: null
};

export const dobHProveedorSlice = createSlice({
  name: "DobHProveedor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHProveedorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
