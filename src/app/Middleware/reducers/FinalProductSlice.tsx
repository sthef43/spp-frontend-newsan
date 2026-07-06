import { IFinalProduct } from "app/models/IFinalProduct";
import { IIniState } from "app/models/IIniState";
import { FinalProductService } from "app/services/finalProduct.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const finalProductService = new FinalProductService();
class finalProductClassSlice extends GenericSlice<IFinalProduct> {
  constructor(private service: FinalProductService) {
    super("FinalProduct", service);
  }
  //nuevos asyncthunks aqui
}
export const FinalProductSliceRequests = new finalProductClassSlice(finalProductService);

const initialState: IIniState<IFinalProduct> = {
  loading: null,
  data: null
};

export const finalProductSlice = createSlice({
  name: "FinalProduct",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    FinalProductSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
