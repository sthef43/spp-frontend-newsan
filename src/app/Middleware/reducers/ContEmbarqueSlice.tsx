import { IContEmbarque } from "app/models/IContEmbarque";
import { ContEmbarqueService } from "app/services/contEmbarque.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const contEmbarqueService = new ContEmbarqueService();
class contEmbarqueClassSlice extends GenericSlice<IContEmbarque> {
  constructor(private service: ContEmbarqueService) {
    super("ContEmbarque", service);
  }
  //nuevos asyncthunks aqui
}
export const ContEmbarqueSliceRequests = new contEmbarqueClassSlice(contEmbarqueService);

const initialState: IIniState<IContEmbarque> = {
  loading: null,
  data: null
};

export const contEmbarqueSlice = createSlice({
  name: "ContEmbarque",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContEmbarqueSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
