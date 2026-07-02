import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { OrganizacionService } from "app/services/organizacion.service";
import { IOrganizacion } from "app/models/IOrganizacion";
const organizaiconService = new OrganizacionService();

class OrganizacionClassSlice extends GenericSlice<IOrganizacion> {
  constructor(private service: OrganizacionService) {
    super("Organizacion", service);
  }
}
export const OrganizacionSliceRequests = new OrganizacionClassSlice(organizaiconService);

const initialState: IIniState<IOrganizacion> = {
  loading: null,
  data: null
};

export const organizacionSlice = createSlice({
  name: "Organizacion",
  initialState: initialState,
  reducers: {}
});
