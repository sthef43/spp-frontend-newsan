import { IAreaPagedPaginator } from "app/models/IAreaPagedPaginator";
import { IIniState } from "app/models/IIniState";
import { AreaPagedPaginatorService } from "app/services/areaPagedPaginator.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";

const areaPagedPaginatorService = new AreaPagedPaginatorService();
class areaPagedPaginatorClassSlice extends GenericSlice<IAreaPagedPaginator> {
  constructor(private service: AreaPagedPaginatorService) {
    super("AreaPagedPaginator", service);
  }
}

export const AreaPagedPaginatorSliceRequests = new areaPagedPaginatorClassSlice(areaPagedPaginatorService);

const initialState: IIniState<IAreaPagedPaginator> = {
  loading: null,
  data: null
};
export const areaPagedPaginatorSlice = createSlice({
  name: "AreaPagedPaginator",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AreaPagedPaginatorSliceRequests.builderAll(builder);
  }
});
