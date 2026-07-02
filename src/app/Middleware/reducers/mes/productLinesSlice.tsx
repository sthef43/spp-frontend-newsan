import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { GenericSliceMes } from "./genericSliceMes";
import { IProductLines } from "app/models/mes/IProductLines";
import { ProductLinesService } from "app/services/mes/productLines.service";

const productLinesService = new ProductLinesService();
class productLinesClassSlice extends GenericSliceMes<IProductLines> {
  constructor(private service: ProductLinesService) {
    super("ProductLines", service);
  }
  //nuevos asyncthunks aqui
}
export const ProductLinesSliceRequests = new productLinesClassSlice(productLinesService);

const initialState: IIniState<IProductLines> = {
  loading: null,
  data: null
};

export const productLinesSlice = createSlice({
  name: "ProductLines",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ProductLinesSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
