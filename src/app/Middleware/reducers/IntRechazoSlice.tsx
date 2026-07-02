import { IIntRechazo } from "app/models/IIntRechazo";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IntRechazoService } from "app/services/intRechazo.service";

const intRechazoService = new IntRechazoService();
class intRechazoClassSlice extends GenericSlice<IIntRechazo> {
  constructor(private service: IntRechazoService) {
    super("IntRechazo", service);
  }
  //nuevos asyncthunks aqui
}
export const IntRechazoSliceRequests = new intRechazoClassSlice(intRechazoService);

const initialState: IIniState<IIntRechazo> = {
  loading: null,
  data: null
};

export const intRechazoSlice = createSlice({
  name: "IntRechazo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    IntRechazoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});