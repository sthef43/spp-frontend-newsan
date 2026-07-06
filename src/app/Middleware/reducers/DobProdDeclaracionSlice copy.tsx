import { DobProdDeclaracionService } from "app/services/dobProdDeclaracion.service";
import { GenericSlice } from "./genericSlice";
import { IDobProdDeclaracion } from "app/models/IDobProdDeclaracion";
import { IIniState } from "app/models";
import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import { IDobMovimientosDeclaracion } from "app/models/IDobMovimientosDeclaracion";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobProdDeclaracionService = new DobProdDeclaracionService();

class DobProdDeclaracionClassSlice extends GenericSlice<IDobProdDeclaracion>{

constructor(private service:DobProdDeclaracionService){
  super("DobProdDeclaracion",service);
  }

AddDeclaracionAndUpdateTotal = createAsyncThunk<boolean,IDobMovimientosDeclaracion>(
  `DobProdDeclaracion/AddDeclaracionAndUpdateTotal`,
  async (mov,info) => {
    return await errorNotification(
      () => this.service.AddDeclaracionAndUpdateTotal(mov),
      info
    );
  }
);

}

export const DobProdDeclaracionSliceRequests =  new DobProdDeclaracionClassSlice(dobProdDeclaracionService);

const initialState: IIniState<IDobProdDeclaracion> = {
  loading:null,
  data:null
}

export const dobProdDeclaracionSlice = createSlice({
  name:"DobProdDeclaracion",
  initialState: initialState,
  reducers:{

    setGroup:(state, action: PayloadAction<IDobProdDeclaracion[]>) =>{
      state.dataAll = action.payload
    }
  },
  extraReducers: (builder) => {
    DobProdDeclaracionSliceRequests.builderAll(builder);
    //aca se agregan los asyncthunks nuevos

    builder.addCase(DobProdDeclaracionSliceRequests.AddDeclaracionAndUpdateTotal.fulfilled,(state, action) =>{
      state.loading = "fulfilled";
      state.data = action.payload;
    });

    builder.addCase(DobProdDeclaracionSliceRequests.AddDeclaracionAndUpdateTotal.rejected,(state,action) => {
      state.loading = "rejected";
    })
  }
})