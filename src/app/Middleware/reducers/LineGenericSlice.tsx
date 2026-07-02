import { IIniState } from "app/models/IIniState";
import { ILineGeneric } from "app/models/ILineGeneric";
import { LineGenericService } from "app/services/lineGeneric.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const lineGenericService = new LineGenericService();
class lineGenericClassSlice extends GenericSlice<ILineGeneric> {
  constructor(private service: LineGenericService) {
    super("LineGeneric", service);
  }
  //nuevos asyncthunks aqui
}
export const LineGenericSliceRequests = new lineGenericClassSlice(lineGenericService);

const initialState: IIniState<ILineGeneric> = {
  loading: null,
  data: null
};

export const lineGenericSlice = createSlice({
  name: "LineGeneric",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    LineGenericSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
