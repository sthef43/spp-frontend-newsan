import { LineasRechazoHabilitadasService } from "app/services/LineasRechazoHabilitadas.service";
import { GenericSlice } from "./genericSlice";
import { ILineasRechazoHabilitadas } from "app/models/ILineasRechazoHablitadas";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IIniState } from "app/models";

const LineasRechazoHabilitadasSrv = new LineasRechazoHabilitadasService();

class LineasRechazoHabilitadasClassSlice extends GenericSlice<ILineasRechazoHabilitadas>{

  constructor(private service: LineasRechazoHabilitadasService){
    super("LineasRechazoHabilitadas", service);
  }
  
  GetAllLineasByFilters = createAsyncThunk<ILineasRechazoHabilitadas,{flagCargadora:boolean;flagRunTest:boolean;flagProTrace:boolean;identificadorLinea:number}>(
    `LineasRechazoHabilitadas/GetAllLineasByFilters`, async ({flagCargadora,flagRunTest,flagProTrace,identificadorLinea},info) =>{
      return await errorNotification( () => this.service.GetAllLineasByFilters(flagCargadora, flagRunTest,flagProTrace,identificadorLinea),info)
    }
  )
}
export const LineasRechazoHabilitadasSliceRequest = new LineasRechazoHabilitadasClassSlice(LineasRechazoHabilitadasSrv);

const initialState: IIniState<ILineasRechazoHabilitadas> = {
  loading:null,
  data: null
};