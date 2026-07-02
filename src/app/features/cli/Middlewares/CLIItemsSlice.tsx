import { IIniState } from "app/models";
import { createSlice } from "@reduxjs/toolkit";
import { ICLIItems } from "../Models/ICLIItems";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { CLIItemsService } from "../Services/cliItems.service";
// import { errorNotification } from "../HelperMidleware/errorNotifications";

const cliItemsService = new CLIItemsService();
class cliItemsClassSlice extends GenericSlice<ICLIItems> {
  constructor(private service: CLIItemsService) {
    super("CLIItems", service);
  }
  //nuevos asyncthunks aqui
  // GetAllByContainerId = createAsyncThunk<ICLIItems[], number>(`CLIItems/GetAllByContainerId`, async (info, thunk) => {
  //     return await errorNotification(() => this.service.GetAllByContainerId(info), thunk)
  // })
  // GetAllWhitoutContainer = createAsyncThunk<ICLIItems[]>(`CLIItems/GetAllWhitoutContainer`, async (_, thunk) => {
  //     return await errorNotification(() => this.service.GetAllWhitoutContainer(), thunk)
  // })
}

export const CLIItemsSliceRequest = new cliItemsClassSlice(cliItemsService);

const initialState: IIniState<ICLIItems> = {
  loading: null,
  data: null,
  dataAll: []
};

export const cliItemsSlice = createSlice({
  name: "CLIItems",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CLIItemsSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
