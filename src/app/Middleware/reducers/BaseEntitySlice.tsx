import { IBaseEntity } from "app/models/IBaseEntity";
import { IIniState } from "app/models/IIniState";
import { BaseEntityService } from "app/services/baseEntity.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const baseEntityService = new BaseEntityService();
class baseEntityClassSlice extends GenericSlice<IBaseEntity> {
  constructor(private service: BaseEntityService) {
    super("BaseEntity", service);
  }
  //nuevos asyncthunks aqui
}
export const BaseEntitySliceRequests = new baseEntityClassSlice(baseEntityService);

const initialState: IIniState<IBaseEntity> = {
  loading: null,
  data: null
};

export const baseEntitySlice = createSlice({
  name: "BaseEntity",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    BaseEntitySliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
