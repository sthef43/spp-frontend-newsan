import { IStoreroom } from "app/models/IStoreroom";
import { StoreroomService } from "app/services/storeroom.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const storeroomService = new StoreroomService();
class storeroomClassSlice extends GenericSlice<IStoreroom> {
  constructor(private service: StoreroomService) {
    super("Storeroom", service);
  }
  //nuevos asyncthunks aqui
}
export const StoreroomSliceRequests = new storeroomClassSlice(storeroomService);

const initialState: IIniState<IStoreroom> = {
  loading: null,
  data: null
};

export const storeroomSlice = createSlice({
  name: "Storeroom",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    StoreroomSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
