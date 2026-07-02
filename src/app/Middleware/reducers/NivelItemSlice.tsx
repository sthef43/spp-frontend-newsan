import { IIniState } from "app/models/IIniState";
import { INivelItem } from "app/models/INivelItem";
import { NivelItemService } from "app/services/nivelItem.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const nivelItemService = new NivelItemService();
class nivelItemClassSlice extends GenericSlice<INivelItem> {
  constructor(private service: NivelItemService) {
    super("NivelItem", service);
  }
  //nuevos asyncthunks aqui
}
export const NivelItemSliceRequests = new nivelItemClassSlice(nivelItemService);

const initialState: IIniState<INivelItem> = {
  loading: null,
  data: null
};

export const nivelItemSlice = createSlice({
  name: "NivelItem",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    NivelItemSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
