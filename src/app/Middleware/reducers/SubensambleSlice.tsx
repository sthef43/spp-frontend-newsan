import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
import { SubensambleSPPService } from "app/services/subensambleSPP.service";
import { ISubensambleSPP } from "app/models/ISubensambleSPP";

const subensambleSPPService = new SubensambleSPPService();
class subensambleSPPClassService extends GenericSlice<ISubensambleSPP> {
  constructor(private service: SubensambleSPPService) {
    super("SubensambleSPP", service);
  }
  //nuevos asyncthunks aqui
}
export const SubensambleSPPSliceRequests = new subensambleSPPClassService(subensambleSPPService);

const initialState: IIniState<ISubensambleSPP> = {
  loading: null,
  data: null
};

export const subensambleSPPSlice = createSlice({
  name: "SubensambleSPP",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SubensambleSPPSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
