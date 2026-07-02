import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ValidadosQrLgService } from "app/services/validadosQrLg.service";
import { IValidadosQrLg } from "app/models/IValidadosQrLg";

const validadosQrLgService = new ValidadosQrLgService();
class validadosQrLgClassSlice extends GenericSlice<IValidadosQrLg> {
  constructor(private service: ValidadosQrLgService) {
    super("ValidadosQrLg", service);
  }
  //nuevos asyncthunks aqui
}
export const ValidadosQrLgSliceRequests = new validadosQrLgClassSlice(validadosQrLgService);

const initialState: IIniState<IValidadosQrLg> = {
  loading: null,
  data: null
};

export const validadosQrLgSlice = createSlice({
  name: "ValidadosQrLg",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ValidadosQrLgSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
