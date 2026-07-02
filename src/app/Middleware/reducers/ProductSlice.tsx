import { IProduct } from "app/models/IProduct";
import { ProductService } from "app/services/product.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const productService = new ProductService();
class productClassSlice extends GenericSlice<IProduct> {
  constructor(private service: ProductService) {
    super("Product", service);
  }
  //nuevos asyncthunks aqui
}
export const ProductSliceRequests = new productClassSlice(productService);

const initialState: IIniState<IProduct> = {
  loading: null,
  data: null
};

export const productSlice = createSlice({
  name: "Product",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ProductSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
