import { ITodo } from "app/models/ITodo";
import { TodoService } from "../services/todo.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { ITodoToday } from "app/models/ITodoToday";

const todoService = new TodoService();
class todoClassSlice extends GenericSlice<ITodo> {
  constructor(private service: TodoService) {
    super("Todo", service);
  }
  getTodoToday = createAsyncThunk<ITodoToday[], { rolId: number; subRolId: number; turnoId: number; plantId: number }>(
    `Todo/getTodoToday`,
    async (modelo, info) => {
      return await errorNotification(
        () => this.service.getTodoToday(modelo.rolId, modelo.subRolId, modelo.turnoId, modelo.plantId),
        info
      );
    }
  );
  getAllByPlantIdAndRolRequest = createAsyncThunk<ITodo[], { rolId: number; plantId: number }>(
    `Todo/GetAllByPlantIdAndRol`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByPlantIdAndRol(modelo.rolId, modelo.plantId), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const TodoSliceRequests = new todoClassSlice(todoService);

const initialState: IIniState<ITodo> = {
  loading: null,
  data: null
};

export const todoSlice = createSlice({
  name: "Todo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TodoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(TodoSliceRequests.getTodoToday.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload as any;
    });
    builder.addCase(TodoSliceRequests.getTodoToday.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TodoSliceRequests.getAllByPlantIdAndRolRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(TodoSliceRequests.getAllByPlantIdAndRolRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
