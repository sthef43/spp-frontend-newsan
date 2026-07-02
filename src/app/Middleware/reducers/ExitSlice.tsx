import { IExit } from "app/models/IExit";
import { IIniState } from "app/models/IIniState";
import { ExitService } from "app/services/exit.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const exitService = new ExitService();
class exitClassSlice extends GenericSlice<IExit> {
  constructor(private service: ExitService) {
    super("Exit", service);
  }
  //nuevos asyncthunks aqui
}
export const ExitSliceRequests = new exitClassSlice(exitService);

const initialState: IIniState<IExit> = {
  loading: null,
  data: null
};

export const exitSlice = createSlice({
  name: "Exit",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ExitSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
