import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { GenericSliceMes } from "./genericSliceMes";
import { IProducts } from "app/models/mes/IProducts";
import { ProductsService } from "app/services/mes/products.service";

const productsService = new ProductsService();
class productsClassSlice extends GenericSliceMes<IProducts> {
  constructor(private service: ProductsService) {
    super("Products", service);
  }
  //nuevos asyncthunks aqui
}
export const ProductsSliceRequests = new productsClassSlice(productsService);

const initialState: IIniState<IProducts> = {
  loading: null,
  data: null
};

export const productsSlice = createSlice({
  name: "Products",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ProductsSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
