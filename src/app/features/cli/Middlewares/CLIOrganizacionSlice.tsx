import { IIniState } from "app/models";
import { createSlice } from "@reduxjs/toolkit";
import { ICLIOrganizacion } from "../Models/ICLIOrganizacion";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { cliOrganizacionService } from "../Services/cliOrganizacion";

const CliOrganizacionService = new cliOrganizacionService();
class CliOrganizacionClassSlice extends GenericSlice<ICLIOrganizacion> {
  constructor(private service: cliOrganizacionService) {
    super("CliOrganizacion", service);
  }

  //Nuevos asyncthunks aqui
}

export const CLIOrganizacionSliceRequest = new CliOrganizacionClassSlice(CliOrganizacionService);

const initialState: IIniState<ICLIOrganizacion> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const CLIOrganizacionSlice = createSlice({
  name: "CliOrganizacion",
  initialState: initialState,
  reducers: {}
});
