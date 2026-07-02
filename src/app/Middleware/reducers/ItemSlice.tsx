import { IIniState } from "app/models/IIniState";
import { IItem } from "app/models/IItem";
import { ItemService } from "app/services/item.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const itemService = new ItemService();
class itemClassSlice extends GenericSlice<IItem> {
  constructor(private service: ItemService) {
    super("Item", service);
  }
  //nuevos asyncthunks aqui
}
export const ItemSliceRequests = new itemClassSlice(itemService);

const initialState: IIniState<IItem> = {
  loading: null,
  data: null
};

export const itemSlice = createSlice({
  name: "Item",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ItemSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
