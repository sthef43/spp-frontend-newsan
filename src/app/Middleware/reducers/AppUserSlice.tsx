import { IAppUser } from "app/models/IAppUser";
import { IAuthRequest } from "app/models/IAuthRequest";
import { IAuthResponse } from "app/models/IAuthResponse";
import { IIniState } from "app/models/IIniState";
import { AppUserService } from "app/services/appUser.service";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const appUserService = new AppUserService();

class AppUserClassSlice extends GenericSlice<IAppUser> {
  constructor(private service: AppUserService) {
    super("Users", service);
  }
  //Nuevos endpoints que no heredan de generic
  LoginUser = createAsyncThunk<IAuthResponse, IAuthRequest>(
    `Users/Authenticate`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.LoginUser(modelo), info);
    }
  );
  getInfoUserById = createAsyncThunk<IAppUser, number>(
    `Users/getInfoUserById/`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.getInfoUserById(modelo), info);
    }
  );
  getInfoUserByDni = createAsyncThunk<IAppUser, number>(
    `Users/getInfoUserByDni`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.getInfoUserByDni(modelo), info);
    }
  );
  GetUserByOperatorId = createAsyncThunk<IAppUser, number>(
    `Users/GetUserByOperatorId`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.GetUserByOperatorId(modelo), info);
    }
  );
  registerRequest = createAsyncThunk<IAppUser, IAppUser>(
    `Users/registerRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.registerRequest(modelo), info);
    }
  );
  getAllUsers = createAsyncThunk<IAppUser[]>(`Users/getAllUsers`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllUsers(), info);
  });
  resetearContrasenia = createAsyncThunk<boolean, number>(
    `Users/ResetearContrasenia`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.resetearContrasenia(modelo), info);
    }
  );
  nuevaContrasenia = createAsyncThunk<boolean, string>(
    `Users/Pass`,

    async (pass, info) => {
      return await errorNotification(() => this.service.nuevaContrasenia(pass), info);
    }
  );
}
export const AppUserSliceRequests = new AppUserClassSlice(appUserService);

const initialState: IIniState<IAppUser> = {
  loading: null,
  data: null,
  object: null,
};

export const appUserSlice = createSlice({
  name: "AppUser",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IAppUser>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    AppUserSliceRequests.builderAll(builder)
    builder.addCase(AppUserSliceRequests.LoginUser.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AppUserSliceRequests.LoginUser.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AppUserSliceRequests.getInfoUserById.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AppUserSliceRequests.getInfoUserById.rejected, (state, action) => {
      state.loading = "rejected";
    });
    //Nuevos slices que no heredan de generic
    builder.addCase(AppUserSliceRequests.getInfoUserByDni.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AppUserSliceRequests.getInfoUserByDni.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AppUserSliceRequests.registerRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AppUserSliceRequests.registerRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AppUserSliceRequests.getAllUsers.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AppUserSliceRequests.getAllUsers.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
