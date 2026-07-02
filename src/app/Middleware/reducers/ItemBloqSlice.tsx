import { IIniState } from "app/models/IIniState";
import { IItemBloq } from "app/models/IItemBloq";
import { ItemBloqService } from "app/services/itemBloq.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const itemBloqService = new ItemBloqService();
class itemBloqClassSlice extends GenericSlice<IItemBloq> {
  constructor(private service: ItemBloqService) {
    super("ItemBloq", service);
  }
  //nuevos asyncthunks aqui
}
export const ItemBloqSliceRequests = new itemBloqClassSlice(itemBloqService);

const initialState: IIniState<IItemBloq> = {
  loading: null,
  data: null
};

export const itemBloqSlice = createSlice({
  name: "ItemBloq",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ItemBloqSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
