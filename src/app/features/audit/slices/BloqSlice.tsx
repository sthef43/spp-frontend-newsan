import { IBloq } from "app/models/IBloq";
import { IIniState } from "app/models/IIniState";
import { BloqService } from "../services/bloq.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const bloqService = new BloqService();
class bloqClassSlice extends GenericSlice<IBloq> {
  constructor(private service: BloqService) {
    super("Bloq", service);
  }
  //nuevos asyncthunks aqui
}
export const BloqSliceRequests = new bloqClassSlice(bloqService);

const initialState: IIniState<IBloq> = {
  loading: null,
  data: null
};

export const bloqSlice = createSlice({
  name: "Bloq",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    BloqSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
