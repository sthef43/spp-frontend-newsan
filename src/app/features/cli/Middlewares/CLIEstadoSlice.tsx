import { IIniState } from "app/models";
import { createSlice } from "@reduxjs/toolkit";
import { ICLIEstado } from "../Models/ICLIEstado";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { CLIEstadoService } from "../Services/cliEstado.service";

const cliEstadoService = new CLIEstadoService();

class cliEstadoClassSlice extends GenericSlice<ICLIEstado> {
  constructor(private service: CLIEstadoService) {
    super("CLIEstado", service);
  }
  //nuevos asyncthunks aqui
}
export const CLIEstadoSliceRequests = new cliEstadoClassSlice(cliEstadoService);

const initialState: IIniState<ICLIEstado> = {
  loading: null,
  data: null
};

export const CLIEstadoSlice = createSlice({
  name: "CLIEstado",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CLIEstadoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
