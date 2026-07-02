import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IRoutes } from "app/models/IRoutes";
import { IRoutesFavoritesOperatorBloq } from "../../models/IRoutesFavoritesOperatorBloq";
import { RoutesFavoritesOperatorBloqService } from "../../services/routesFavoritesOperatorBloq.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const routesFavoritesOperatorBloqService = new RoutesFavoritesOperatorBloqService();

class routesFavoritesOperatorBloqClassSlice extends GenericSlice<IRoutesFavoritesOperatorBloq> {
  constructor(private service: RoutesFavoritesOperatorBloqService) {
    super("RoutesFavoritesOperatorBloq", service);
  }

  GetAllRoutesByOperatorId = createAsyncThunk<IRoutes[], number>(
    `RoutesFavoritesOperatorBloq/GetAllRoutesByOperatorId`,
    async (operatorId, info) => {
      return await errorNotification(() => this.service.GetAllRoutesByOperatorId(operatorId), info);
    }
  );

  SearchAndDeleteFavorite = createAsyncThunk<boolean, { operatorId; routeId }>(
    `RoutesFavoritesOperatorBloq/SearchAndDeleteFavorite`,
    async ({ operatorId, routeId }, info) => {
      return await errorNotification(() => this.service.SearchAndDeleteFavorite(operatorId, routeId), info);
    }
  );

  ChangeRoutePriority = createAsyncThunk<boolean, IRoutes>(
    `RoutesFavoritesOperatorBloq/ChangeRoutePriority`,
    async (route, info) => {
      return await errorNotification(() => this.service.ChangeRoutePriority(route), info);
    }
  );
}

export const RoutesFavoritesOperatorBloqSliceRequest = new routesFavoritesOperatorBloqClassSlice(
  routesFavoritesOperatorBloqService
);

const inititalState: IIniState<IRoutesFavoritesOperatorBloq> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const routesFavoritesOperatorBloqSlice = createSlice({
  name: "RoutesFavoritesOperatorBloq",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    RoutesFavoritesOperatorBloqSliceRequest.builderAll(builder);
  }
});
