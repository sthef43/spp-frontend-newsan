import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { IBaseEntityMes } from "app/models/mes/IBaseEntityMes";
import { GenericMesService } from "app/services/mes/genericMes.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export class GenericSliceMes<T extends IBaseEntityMes> {
  getAllRequest = createAsyncThunk<T[]>(
    `${this.modelo}/GetAllRequest`,

    async (x, info) => {
      return await errorNotification(() => this.areaSrv.GetAllRequest(), info);
    }
  );
  getByIdRequest = createAsyncThunk<T, number>(
    `${this.modelo}/GetByIdRequest`,

    async (number, info) => {
      return await errorNotification(() => this.areaSrv.GetByIdRequest(number), info);
    }
  );
  PostRequest = createAsyncThunk<T, T>(
    `${this.modelo}/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.areaSrv.PostRequest(modelo), info);
    }
  );
  PutRequest = createAsyncThunk<T, T>(
    `${this.modelo}/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.areaSrv.PutRequest(modelo), info);
    }
  );
  multiPostRequest = createAsyncThunk<boolean, T[]>(
    `${this.modelo}/MultiPostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.areaSrv.MultiPostRequest(modelo), info);
    }
  );
  multiPutRequest = createAsyncThunk<boolean, T[]>(
    `${this.modelo}/MultiputRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.areaSrv.MultiPutRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `${this.modelo}/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.areaSrv.DeleteRequest(number), info);
    }
  );
  constructor(private modelo: string, private areaSrv: GenericMesService<T>) {}
  builderAll(builder) {
    builder.addCase(this.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(this.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(this.PostRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.PostRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(this.PutRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.PutRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(this.multiPostRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.multiPostRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(this.multiPutRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.multiPutRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(this.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
}
