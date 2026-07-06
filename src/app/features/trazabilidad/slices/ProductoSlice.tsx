import { IIniState } from "app/models/IIniState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IProducto } from "app/models/IProducto";
import { ProductoService } from "../services/producto.service";
const productoService = new ProductoService();
class productoClassSlice extends GenericSlice<IProducto> {
  constructor(private service: ProductoService) {
    super("Producto", service);
  }
  //nuevos asyncthunks aqui
}
export const ProductoSliceRequests = new productoClassSlice(productoService);

const initialState: IIniState<IProducto> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const productoSlice = createSlice({
  name: "Producto",
  initialState: initialState,
  reducers: {
    setProducto: (state, action: PayloadAction<IProducto>) => {
      state.object = action.payload;
    },
    setFindProduct: (state, action: PayloadAction<number>) => {
      state.object = state.dataAll.find((elementos) => { return elementos.id == action.payload})
    }
  },
  extraReducers: (builder) => {
    ProductoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
