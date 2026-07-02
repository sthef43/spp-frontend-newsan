import { RoutesAyudaPadresService } from "app/features/ayuda/services/routesAyudaPadres.service";
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { IRoutesAyudaPadres } from "app/features/ayuda/models/IRoutesAyudaPadres";
import { IIniState } from "app/models";
import { createSlice } from "@reduxjs/toolkit";

const routesAyudaPadresService = new RoutesAyudaPadresService();

class routesAyudaPadresClassSlice extends GenericSlice<IRoutesAyudaPadres> {
  constructor(private service: RoutesAyudaPadresService) {
    super("RoutesAyudaPadre", service);
  }
}

export const RoutesAyudaPadresSliceRequest = new routesAyudaPadresClassSlice(routesAyudaPadresService);

const initialState: IIniState<IRoutesAyudaPadres> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const routesAyudaPadresSlice = createSlice({
  name: "RoutesAyudaPadre",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RoutesAyudaPadresSliceRequest.builderAll(builder);
  }
});
