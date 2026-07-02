import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { ICLITipoUBC } from "../Models/ICLITipoUBC";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { CLITipoUBCService } from "../Services/cliTipoUBC.service";

const cliTipoUBCService = new CLITipoUBCService();
class cliTipoUBCClassSlice extends GenericSlice<ICLITipoUBC> {
  constructor(private service: CLITipoUBCService) {
    super("CLITipoUBC", service);
  }
  //nuevos asyncthunks aqui
}
export const CLITipoUBCSliceRequests = new cliTipoUBCClassSlice(cliTipoUBCService);

const initialState: IIniState<ICLITipoUBC> = {
  loading: null,
  data: null
};

export const CLITipoUBCSlice = createSlice({
  name: "CLITipoUBC",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CLITipoUBCSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
