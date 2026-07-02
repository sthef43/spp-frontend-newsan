import { IBaseEntity } from "app/models/IBaseEntity";
import { GenericService, SearchRequestDTO } from "app/services/generic.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";

export class GenericSlice<T extends IBaseEntity> {
  getAllRequest = createAsyncThunk<T[]>(
    `${this.modelo}/GetAllRequest`,

    async (x, info) => {
      return await errorNotification(() => this.areaSrv.GetAllRequest(), info);
    }
  );

  SearchRequest = createAsyncThunk<boolean, SearchRequestDTO>(
    `${this.modelo}/SearchRequest`,

    async (modelo: SearchRequestDTO, info) => {
      return await errorNotification(() => this.areaSrv.SearchRequest(modelo), info);
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
  NestedAddRequest = createAsyncThunk<T, T>(
    `${this.modelo}/NestedAdd`,

    async (modelo, info) => {
      return await errorNotification(() => this.areaSrv.NestedAddRequest(modelo), info);
    }
  );
  NestedUpdateRequest = createAsyncThunk<T, T>(
    `${this.modelo}/NestedUpdate`,

    async (modelo, info) => {
      return await errorNotification(() => this.areaSrv.NestedUpdateRequest(modelo), info);
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
  TransactionNestedAddRequest = createAsyncThunk<boolean, T>(
    `${this.modelo}/TransactionNestedAdd`,

    async (modelo, info) => {
      return await errorNotification(() => this.areaSrv.TransactionNestedAddRequest(modelo), info);
    }
  );
  getAllByDateFromToRequest = createAsyncThunk<T[], { dateFrom: string; dateTo: string }>(
    `${this.modelo}/GetAllByDateFromTo`,

    async ({ dateFrom, dateTo }, info) => {
      return await errorNotification(() => this.areaSrv.GetAllByDateFromTo(dateFrom, dateTo), info);
    }
  );

  constructor(private modelo: string, private areaSrv: GenericService<T>) {}
  builderAll(builder) {
    builder.addCase(this.SearchRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });

    builder.addCase(this.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
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
    builder.addCase(this.NestedAddRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.NestedAddRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(this.NestedUpdateRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(this.NestedUpdateRequest.rejected, (state, action) => {
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
    builder.addCase(this.getAllByDateFromToRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(this.getAllByDateFromToRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
}
